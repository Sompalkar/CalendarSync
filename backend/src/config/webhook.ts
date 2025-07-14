export const getWebhookUrl = async (): Promise<string> => {
  return process.env.BACKEND_URL || "https://your-domain.com";
};

export const getFullWebhookUrl = async (): Promise<string> => {
  // Append the webhook path to the backend URL
  const base = process.env.BACKEND_URL || "https://your-domain.com";
  return `${base}/api/webhook/calendar`;
};
