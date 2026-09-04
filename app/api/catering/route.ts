import { NextResponse } from 'next/server';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_TO_EMAIL = 'otrservicesie@gmail.com';
const DEFAULT_FROM_EMAIL = 'Muerto De Hambre Catering <onboarding@resend.dev>';

type CateringPayload = {
  name?: unknown;
  phone?: unknown;
  estimated_guests?: unknown;
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
  const message = cleanText(payload.event_message, 3000);
  const guests = Number.parseInt(guestText, 10);
  const phoneDigits = phone.replace(/\D/g, '');

  if (
    name.length < 2 ||
    phoneDigits.length < 7 ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 10000 ||
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

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
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
        'New Muerto De Hambre catering request',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Estimated guests: ${guests}`,
        `Submitted: ${submittedAt} PT`,
        '',
        'Event details:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#111;color:#f5f5f5;padding:28px;line-height:1.55">
          <div style="max-width:640px;margin:0 auto;background:#191919;border:1px solid #7f1d1d;border-radius:18px;overflow:hidden">
            <div style="background:#8b1e1e;padding:22px 26px">
              <div style="font-size:12px;letter-spacing:2px;font-weight:700;text-transform:uppercase">Muerto De Hambre Grill</div>
              <h1 style="font-size:26px;margin:5px 0 0">New Catering Request</h1>
            </div>
            <div style="padding:26px">
              <table role="presentation" style="width:100%;border-collapse:collapse;color:#f5f5f5">
                <tr><td style="padding:8px 0;color:#c9c9c9;width:155px">Name</td><td style="padding:8px 0;font-weight:700">${safeName}</td></tr>
                <tr><td style="padding:8px 0;color:#c9c9c9">Phone</td><td style="padding:8px 0;font-weight:700">${safePhone}</td></tr>
                <tr><td style="padding:8px 0;color:#c9c9c9">Estimated guests</td><td style="padding:8px 0;font-weight:700">${guests}</td></tr>
                <tr><td style="padding:8px 0;color:#c9c9c9">Submitted</td><td style="padding:8px 0">${escapeHtml(submittedAt)} PT</td></tr>
              </table>
              <div style="margin-top:22px;padding-top:20px;border-top:1px solid #3f3f46">
                <div style="font-size:12px;letter-spacing:1.5px;color:#f87171;font-weight:700;text-transform:uppercase">Event details</div>
                <p style="margin:10px 0 0;font-size:16px">${safeMessage}</p>
              </div>
            </div>
          </div>
        </div>
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
