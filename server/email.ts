import { notifyOwner } from "./_core/notification";

const RESEND_SEND_URL = "https://api.resend.com/emails";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (process.env.VITEST && process.env.ENABLE_TRANSACTIONAL_EMAIL_IN_TESTS !== "true") {
    return { delivered: false as const, reason: "test_mode" as const };
  }

  const config = getResendConfig();

  if (!config) {
    return { delivered: false as const, reason: "missing_config" as const };
  }

  try {
    const response = await fetch(RESEND_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      await notifyOwner({
        title: "GetBooked email delivery failed",
        content: `Resend rejected an email to ${payload.to}: ${response.status} ${errorText}`,
      });
      return { delivered: false as const, reason: "provider_error" as const };
    }

    return { delivered: true as const };
  } catch (error) {
    await notifyOwner({
      title: "GetBooked email delivery failed",
      content: `Network failure while sending to ${payload.to}: ${error instanceof Error ? error.message : String(error)}`,
    });
    return { delivered: false as const, reason: "network_error" as const };
  }
}
