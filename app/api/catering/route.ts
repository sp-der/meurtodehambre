import { NextResponse } from 'next/server';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_TO_EMAIL = 'otrservicesie@gmail.com';
const DEFAULT_FROM_EMAIL = 'Muerto De Hambre Catering <onboarding@resend.dev>';
const SITE_URL = 'https://meurtodehambre.vercel.app';
const BACKDROP_URL = `${SITE_URL}/brand/backdrop.webp`;
const HEADER_LOGO_URL = `${SITE_URL}/brand/header.webp`;

type CateringPayload = {
  name?: unknown;
  phone?: unknown;
  estimated_guests?: unknown;
  event_date?: unknown;
  event_message?: unknown;
  honey?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatEventDate(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function readPayload(request: Request): Promise<CateringPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await request.json()) as CateringPayload;
  }

  const form = await request.formData();
  return {
    name: form.get('name'),
    phone: form.get('phone'),
    estimated_guests: form.get('estimated_guests'),
    event_date: form.get('event_date'),
    event_message: form.get('event_message'),
    honey: form.get('_honey'),
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Catering email failed: RESEND_API_KEY is not configured.');
    return NextResponse.json(
      { ok: false, error: 'Email service is not configured yet.' },
      { status: 500 },
    );
  }

  let payload: CateringPayload;

  try {
    payload = await readPayload(request);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid catering request.' },
      { status: 400 },
    );
  }

  // Quietly accept bot submissions so the honeypot does not teach bots how it works.
  if (cleanText(payload.honey, 120)) {
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(payload.name, 120);
  const phone = cleanText(payload.phone, 60);
  const guestText = cleanText(payload.estimated_guests, 10);
  const eventDate = cleanText(payload.event_date, 10);
  const message = cleanText(payload.event_message, 3000);
  const guests = Number.parseInt(guestText, 10);
  const phoneDigits = phone.replace(/\D/g, '');
  const validEventDate = /^\d{4}-\d{2}-\d{2}$/.test(eventDate) && !Number.isNaN(new Date(`${eventDate}T12:00:00`).getTime());

  if (
    name.length < 2 ||
    phoneDigits.length < 7 ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 10000 ||
    !validEventDate ||
    message.length < 3
  ) {
    return NextResponse.json(
      { ok: false, error: 'Please complete every catering field.' },
      { status: 400 },
    );
  }

  const toEmail = process.env.CATERING_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.CATERING_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const formattedEventDate = formatEventDate(eventDate);

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEventDate = escapeHtml(formattedEventDate);
  const safeSubmittedAt = escapeHtml(submittedAt);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New Muerto De Hambre catering request - ${name}`,
      text: [
        'MUERTO DE HAMBRE GRILL',
        'New Catering Request',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Date of event: ${formattedEventDate}`,
        `Estimated guests: ${guests}`,
        `Submitted: ${submittedAt} PT`,
        '',
        'Event details:',
        message,
      ].join('\n'),
      html: `
        <!doctype html>
        <html lang="en">
          <body style="margin:0;padding:0;background:#0d0c09;font-family:Arial,Helvetica,sans-serif;color:#fff6df;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#0d0c09;margin:0;padding:0;">
              <tr>
                <td align="center" style="padding:28px 12px;">
                  <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;background:#11100d;border:1px solid #a97931;border-radius:26px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.45);">
                    <tr>
                      <td background="${BACKDROP_URL}" style="background-color:#11100d;background-image:linear-gradient(rgba(8,7,5,.72),rgba(8,7,5,.92)),url('${BACKDROP_URL}');background-position:center;background-size:cover;padding:18px 24px 20px;border-bottom:1px solid #8d6225;text-align:center;">
                        <img src="${HEADER_LOGO_URL}" width="170" alt="Muerto De Hambre Grill" style="display:block;width:170px;max-width:62%;height:auto;margin:0 auto 10px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.5));" />
                        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.08;color:#fff6df;font-weight:700;letter-spacing:-.3px;">New Catering Request</h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:24px 24px 10px;background:#11100d;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border-spacing:0 10px;">
                          <tr>
                            <td style="background:#191711;border:1px solid #5d4728;border-radius:16px;padding:15px 16px;">
                              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b99350;font-weight:800;margin-bottom:6px;">Name</div>
                              <div style="font-size:19px;line-height:1.25;color:#fff6df;font-weight:800;">${safeName}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="background:#191711;border:1px solid #5d4728;border-radius:16px;padding:15px 16px;">
                              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b99350;font-weight:800;margin-bottom:6px;">Phone</div>
                              <a href="tel:${phoneDigits}" style="font-size:19px;line-height:1.25;color:#f0bf63;font-weight:800;text-decoration:none;">${safePhone}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:0 24px;background:#11100d;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border-spacing:10px 0;">
                          <tr>
                            <td width="58%" valign="top" style="background:#201a10;border:1px solid #a97931;border-radius:16px;padding:16px;">
                              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d7a447;font-weight:800;margin-bottom:7px;">Date of Event</div>
                              <div style="font-size:17px;line-height:1.35;color:#fff0b2;font-weight:800;">${safeEventDate}</div>
                            </td>
                            <td width="42%" valign="top" style="background:#201a10;border:1px solid #a97931;border-radius:16px;padding:16px;">
                              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d7a447;font-weight:800;margin-bottom:7px;">Guests</div>
                              <div style="font-size:24px;line-height:1.1;color:#fff0b2;font-weight:900;">${guests}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:28px 24px 8px;background:#11100d;">
                        <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#d7a447;font-weight:900;margin-bottom:10px;">Event Details</div>
                        <div style="background:#17140f;border:1px solid #5d4728;border-radius:18px;padding:18px;color:#f3eadb;font-size:16px;line-height:1.65;">${safeMessage}</div>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:18px 24px 26px;background:#11100d;text-align:center;">
                        <div style="height:1px;background:#3a3021;margin-bottom:18px;"></div>
                        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8f8064;font-weight:800;">Submitted</div>
                        <div style="margin-top:5px;color:#b9ab8d;font-size:12px;line-height:1.5;">${safeSubmittedAt} PT</div>
                        <div style="margin-top:15px;color:#6f654f;font-size:11px;line-height:1.55;">Muerto De Hambre Grill · San Bernardino · Lawndale · Riverside</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    }),
    cache: 'no-store',
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    console.error('Catering email failed through Resend:', resendResponse.status, resendError);
    return NextResponse.json(
      { ok: false, error: 'The catering request could not be emailed. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
