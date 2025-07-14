import { checkNgrokStatus } from "../utils/ngrokStatus";

export const getWebhookUrl = async (): Promise<string> => {
  // In development, use ngrok URL
  if (process.env.NODE_ENV === "development") {
    const ngrokUrl = await checkNgrokStatus();
    return (
      ngrokUrl ||
      process.env.NGROK_URL ||
      "https://calendar-sync-webhook.ngrok.io"
    );
  }

  // In production, use your domain
  return process.env.BACKEND_URL || "https://your-domain.com";
};

export const getFullWebhookUrl = async (): Promise<string> => {
  const baseUrl = await getWebhookUrl();
  return `${baseUrl}/api/webhook/calendar`;
};
