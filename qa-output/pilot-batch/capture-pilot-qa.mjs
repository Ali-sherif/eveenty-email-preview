/** Six-template owner-review pilot — Level A Chromium + structural QA. */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../../shared/render-emails.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'qa-output/pilot-batch');
const shotDir = join(outDir, 'screenshots');
mkdirSync(shotDir, { recursive: true });

const CASES = [
  { id:'password_reset', locales:['en','fr','es','ar','fa'], variants:['default'], defaultVariant:'default' },
  { id:'refund_receipt_user', locales:['en','fr','es','ar','fa'], variants:['refundAndCanceled','refundOnly','canceledOnly'], defaultVariant:'refundAndCanceled' },
  { id:'festival_ticket_registration_reject', locales:['en','fr','es','ar','fa'], variants:['user','organizer','admin'], defaultVariant:'user' },
  { id:'festival_approval_status_changed', locales:['en','fr','es','ar','fa'], variants:['approved','approvedWithNote','rejected','rejectedWithNote'], defaultVariant:'approvedWithNote' },
  { id:'contact_submission', locales:['en'], variants:['default'], defaultVariant:'default' },
  { id:'organizer_announcement', locales:['en'], variants:['default'], defaultVariant:'default' },
];
const widths = [800, 414, 375, 320];
const MIME={'.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
function startServer() {
  const server=createServer((req,res)=>{ const rel=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, ''); const path=join(root,rel); if(!path.startsWith(root)||!existsSync(path)){res.writeHead(404);res.end();return;} res.writeHead(200,{'Content-Type':MIME[extname(path).toLowerCase()]||'application/octet-stream'}); res.end(readFileSync(path)); });
  return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve({server,origin:`http://127.0.0.1:${server.address().port}/`})));
}
const {server,origin:assetBase}=await startServer();

function luminance(hex) {
  const h = hex.replace('#','');
  const rgb = [0,2,4].map((i) => { const c=parseInt(h.slice(i,i+2),16)/255; return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4; });
  return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
}
function contrast(fg,bg) { const a=luminance(fg), b=luminance(bg); return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05); }
const contrastResults = [
  ['heading/white','#2b2a28','#ffffff'], ['body/white','#4d4c49','#ffffff'],
  ['success/surface','#166534','#f0fdf4'], ['error/surface','#991b1b','#fef2f2'],
  ['cta/primary','#4d4c49','#e9d023'],
].map(([name,fg,bg]) => ({ name, fg, bg, ratio:+contrast(fg,bg).toFixed(2), status:contrast(fg,bg)>=4.5?'PASS':'FAIL' }));

function structural(id, locale, variant, html) {
  const findings=[];
  const check=(name,ok,detail='')=>findings.push({name,status:ok?'PASS':'FAIL',detail});
  const bytes=Buffer.byteLength(html,'utf8');
  check('html-under-102kb',bytes<102*1024,`${bytes} bytes`);
  check('table-layout',/<table role="presentation"/.test(html));
  check('container-600',/max-width:600px/.test(html));
  check('approved-heading',/#2b2a28/i.test(html));
  check('approved-body',/#4d4c49/i.test(html));
  check('approved-border',/#ebebeb/i.test(html));
  check('no-forbidden-elements',!/<(?:script|form|iframe|video|audio)\b/i.test(html));
  check('no-unsafe-layout-css',!/\b(?:display:flex|display:grid|gap:|object-fit:|calc\(|var\()/.test(html));
  check('no-base64-images',!/src=["']data:/i.test(html));
  check('no-rejected-copy-colors',!/(#898988|#629a77|#ad6f45|#b75c5e)/i.test(html));
  check('lang-dir',new RegExp(`<html lang="${locale === 'en' || id === 'contact_submission' || id === 'organizer_announcement' || (id === 'festival_ticket_registration_reject' && variant === 'admin') ? 'en' : locale}"`).test(html));
  if (['password_reset','refund_receipt_user','festival_ticket_registration_reject','festival_approval_status_changed','contact_submission'].includes(id)) check('logo-160',/width="160"/.test(html));
  if (id==='festival_ticket_registration_reject') check('error-alert-aa',/#fef2f2/i.test(html)&&/#991b1b/i.test(html)&&/border-radius:16px/.test(html));
  if (id==='festival_approval_status_changed' && variant.startsWith('approved')) check('success-alert-aa',/#f0fdf4/i.test(html)&&/#166534/i.test(html)&&/border-radius:16px/.test(html));
  return { id, locale, variant, bytes, findings, failCount:findings.filter(f=>f.status==='FAIL').length };
}

const catalog=JSON.parse(readFileSync(join(root,'catalog/email-catalog.json'),'utf8'));
const pilotIds=CASES.map(c=>c.id);
const catalogChecks={
  physical:catalog.emails.length,
  inScope:catalog.emails.filter(e=>e.scope==='IN_SCOPE').length,
  designed:catalog.emails.filter(e=>e.design_status==='DESIGNED').length,
  undesigned:catalog.emails.filter(e=>e.scope==='IN_SCOPE'&&e.design_status==='UNDESIGNED').length,
  pilotReady:pilotIds.every(id=>{const e=catalog.emails.find(x=>x.id===id); return e?.design_status==='DESIGNED'&&e.preview_selectable===true&&e.preview===`emails/${id}.html`; }),
};

const staticAudits=[];
for (const c of CASES) for (const locale of c.locales) for (const variant of c.variants) {
  const html=renderEmail(c.id,{locale,variant,assetBase});
  staticAudits.push(structural(c.id,locale,variant,html));
}

const browser=await chromium.launch();
const page=await browser.newPage();
const responsive=[];
const screenshots=[];
try {
  for (const c of CASES) {
    const locales=c.locales.includes('ar')?['en','ar']:['en'];
    for (const locale of locales) for (const width of widths) {
      const html=renderEmail(c.id,{locale,variant:c.defaultVariant,longContent:false,assetBase});
      await page.setViewportSize({width,height:1000});
      await page.setContent(html,{waitUntil:'load'});
      await page.waitForTimeout(80);
      const measure=await page.evaluate(() => ({
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,
        scrollWidth:document.documentElement.scrollWidth,
        clientWidth:document.documentElement.clientWidth,
        dir:document.documentElement.dir,
      }));
      responsive.push({id:c.id,locale,width,status:measure.overflow?'FAIL':'PASS',...measure});
      if (locale==='en'&&(width===800||width===320)) {
        const path=join(shotDir,`${c.id}--${width===800?'desktop-800':'mobile-320'}.png`);
        await page.screenshot({path,fullPage:true});
        screenshots.push(path);
      }
    }
    const stressHtml=renderEmail(c.id,{locale:'en',variant:c.defaultVariant,longContent:true,assetBase});
    await page.setViewportSize({width:320,height:1000});
    await page.setContent(stressHtml,{waitUntil:'load'});
    const stress=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,dir:document.documentElement.dir}));
    responsive.push({id:c.id,locale:'en-long',width:320,status:stress.overflow?'FAIL':'PASS',...stress});
  }
} finally { await browser.close(); server.close(); }

const report={
  generatedAt:new Date().toISOString(),
  scope:'Six-template pilot; HTML Preview only',
  catalogChecks,
  structuralSummary:{checks:staticAudits.length,failCount:staticAudits.reduce((n,a)=>n+a.failCount,0)},
  responsiveSummary:{checks:responsive.length,failCount:responsive.filter(r=>r.status==='FAIL').length,rtlChecks:responsive.filter(r=>r.dir==='rtl').length},
  contrastResults,
  screenshots,
  staticAudits,
  responsive,
  levelB:{gmail:'NOT RUN',outlook:'NOT RUN',appleMail:'NOT RUN'},
};
writeFileSync(join(outDir,'pilot-qa-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({catalogChecks,structuralSummary:report.structuralSummary,responsiveSummary:report.responsiveSummary,contrastResults,screenshots:screenshots.length},null,2));
const failed=!catalogChecks.pilotReady||catalogChecks.physical!==59||catalogChecks.inScope!==48||report.structuralSummary.failCount||report.responsiveSummary.failCount||contrastResults.some(r=>r.status==='FAIL');
process.exit(failed?1:0);
