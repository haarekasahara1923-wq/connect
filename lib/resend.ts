import { Resend } from 'resend';

// Only initialize if API key exists to prevent crashing purely on build/import
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({
  to, subject, html
}: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn('Resend API Key is missing. Email not sent:', { to, subject });
    return;
  }

  try {
    await resend.emails.send({
      from: 'InfluencerConnect <noreply@influencerconnect.in>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email send failed:', err);
    // Don't throw — email failure should not break core flow
  }
}
