package email

import (
	"bytes"
	"encoding/base64"
	"io"
	"mime"
	"mime/multipart"
	"mime/quotedprintable"
	"net/mail"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestMimeMessageHeadersAndAlternative(t *testing.T) {
	fixed := time.Date(2026, 3, 15, 12, 0, 0, 0, time.UTC)
	msg := mimeMessage{
		FromName:  "Eve\r\nenty",
		FromEmail: "from@eveenty.com",
		ToName:    "بو\nب",
		ToEmail:   "to@eveenty.com",
		Subject:   "تذاكر\r\nBcc: evil@example.com",
		HTML:      []byte("<!DOCTYPE html><html><body><p>Hello مرحبا</p></body></html>"),
		now:       func() time.Time { return fixed },
	}
	raw, err := msg.Bytes("eveenty.com")
	require.NoError(t, err)
	text := string(raw)

	require.NotContains(t, text, "\nBcc:")
	require.NotContains(t, text, "boundary-string")
	require.Contains(t, text, "MIME-Version: 1.0")
	require.Contains(t, text, "Date: ")
	require.Contains(t, text, "Message-ID: <")
	require.Contains(t, text, "@eveenty.com>")
	require.Contains(t, text, "multipart/alternative")
	require.Regexp(t, `=\?UTF-8\?[Bb]\?.+\?=`, text)

	parsed, err := mail.ReadMessage(bytes.NewReader(raw))
	require.NoError(t, err)
	dec := new(mime.WordDecoder)
	subject, err := dec.DecodeHeader(parsed.Header.Get("Subject"))
	require.NoError(t, err)
	require.Equal(t, "تذاكرBcc: evil@example.com", subject)
	require.NotContains(t, parsed.Header.Get("From"), "\n")
	require.Contains(t, parsed.Header.Get("From"), "Eveenty")

	to, err := dec.DecodeHeader(parsed.Header.Get("To"))
	require.NoError(t, err)
	require.Contains(t, to, "بوب")
	require.Contains(t, to, "to@eveenty.com")

	htmlBody := string(extractHTMLBody(raw))
	require.Contains(t, htmlBody, "<!DOCTYPE html>")
	require.Contains(t, htmlBody, "Hello مرحبا")
	require.NotContains(t, htmlBody, "Content-Type:")

	media, params, err := mime.ParseMediaType(parsed.Header.Get("Content-Type"))
	require.NoError(t, err)
	require.Equal(t, "multipart/alternative", media)
	mr := multipart.NewReader(parsed.Body, params["boundary"])
	plain, err := mr.NextRawPart()
	require.NoError(t, err)
	require.Contains(t, plain.Header.Get("Content-Type"), "text/plain")
	require.Equal(t, "quoted-printable", plain.Header.Get("Content-Transfer-Encoding"))
	plainBody, err := io.ReadAll(quotedprintable.NewReader(plain))
	require.NoError(t, err)
	require.Contains(t, string(plainBody), "Hello")
}

func TestMimeMessageAttachmentWrapping(t *testing.T) {
	payload := bytes.Repeat([]byte{0x10, 0x20, 0x30, 0xFF}, 30)
	ics := []byte("BEGIN:VCALENDAR\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n")
	msg := mimeMessage{
		FromName:  "Eveenty",
		FromEmail: "from@eveenty.com",
		ToName:    "Buyer",
		ToEmail:   "buyer@example.com",
		Subject:   "Tickets",
		HTML:      []byte("<!DOCTYPE html><html><body>Ticket</body></html>"),
		Attachments: []mimeAttachment{
			{
				Filename:    "ticket-1.pkpass",
				ContentType: "application/vnd.apple.pkpass",
				ContentID:   "ticket-1@eveenty.com",
				Data:        payload,
			},
			{
				Filename:    "event.ics",
				ContentType: `text/calendar; method=PUBLISH; charset=UTF-8; name="event.ics"`,
				ContentID:   "event@eveenty.com",
				Data:        ics,
			},
		},
	}
	raw, err := msg.Bytes("eveenty.com")
	require.NoError(t, err)

	parsed, err := mail.ReadMessage(bytes.NewReader(raw))
	require.NoError(t, err)
	media, params, err := mime.ParseMediaType(parsed.Header.Get("Content-Type"))
	require.NoError(t, err)
	require.Equal(t, "multipart/mixed", media)
	require.NotEmpty(t, params["boundary"])

	mr := multipart.NewReader(parsed.Body, params["boundary"])
	var sawPass, sawICS bool
	for {
		p, err := mr.NextPart()
		if err == io.EOF {
			break
		}
		require.NoError(t, err)
		body, err := io.ReadAll(p)
		require.NoError(t, err)
		ct := p.Header.Get("Content-Type")
		switch {
		case strings.Contains(ct, "pkpass"):
			sawPass = true
			require.Equal(t, "base64", p.Header.Get("Content-Transfer-Encoding"))
			require.Contains(t, p.Header.Get("Content-ID"), "@")
			require.True(t, strings.HasPrefix(p.Header.Get("Content-ID"), "<ticket-1@"))
			for _, line := range strings.Split(strings.TrimRight(string(body), "\r\n"), "\r\n") {
				require.LessOrEqual(t, len(line), 76)
			}
			decoded, err := base64.StdEncoding.DecodeString(strings.ReplaceAll(string(body), "\r\n", ""))
			require.NoError(t, err)
			require.Equal(t, payload, decoded)
		case strings.Contains(ct, "calendar"):
			sawICS = true
			require.Contains(t, ct, "method=PUBLISH")
			require.Contains(t, p.Header.Get("Content-ID"), "@")
			decoded, err := base64.StdEncoding.DecodeString(strings.ReplaceAll(string(body), "\r\n", ""))
			require.NoError(t, err)
			require.Equal(t, ics, decoded)
		}
	}
	require.True(t, sawPass)
	require.True(t, sawICS)
}

func TestFormatContentIDRequiresAt(t *testing.T) {
	require.Equal(t, "<ticket-1@eveenty.com>", formatContentID("ticket-1"))
	require.Equal(t, "<ticket-2@eveenty.com>", formatContentID("<ticket-2@eveenty.com>"))
}
