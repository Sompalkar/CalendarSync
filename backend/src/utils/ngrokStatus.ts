import fetch from "node-fetch";

export const checkNgrokStatus = async (): Promise<string | null> => {
  try {
    const response = await fetch("http://localhost:4040/api/tunnels");
    const data = await response.json();

    if (data.tunnels && data.tunnels.length > 0) {
      const httpsTunnel = data.tunnels.find(
        (tunnel: any) => tunnel.proto === "https"
      );
      return httpsTunnel ? httpsTunnel.public_url : null;
    }

    return null;
  } catch (error) {
    console.error("Failed to check ngrok status:", error);
    return null;
  }
};

export const waitForNgrok = async (maxAttempts = 30): Promise<string> => {
  for (let i = 0; i < maxAttempts; i++) {
    const url = await checkNgrokStatus();
    if (url) {
      console.log(`✅ ngrok tunnel ready: ${url}`);
      return url;
    }

    console.log(
      `⏳ Waiting for ngrok tunnel... (attempt ${i + 1}/${maxAttempts})`
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("ngrok tunnel not available after maximum attempts");
};
