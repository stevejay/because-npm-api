import * as crypto from "crypto";

export default async function computeResponseToken(
  crcToken: string
): Promise<string> {
  const crcTokenHash = await computeHmac(
    "sha256",
    process.env.TWITTER_CONSUMER_API_SECRET_KEY || "",
    crcToken
  );
  return `sha256=${crcTokenHash}`;
}

function computeHmac(
  algorithm: string,
  key: string | Buffer,
  payload: string | Buffer
): Promise<string> {
  const hmac = crypto.createHmac(algorithm, key);
  return new Promise<string>((resolve, reject) => {
    hmac.on("readable", () => {
      const data = hmac.read();
      if (!data) {
        return reject("No data");
      }
      return resolve((data as any).toString("base64"));
    });
    hmac.write(payload);
    hmac.end();
  });
}
