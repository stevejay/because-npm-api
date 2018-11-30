import XRay from "aws-xray-sdk";

const xRayIsActive =
  process.env.IS_OFFLINE || process.env.NODE_ENV !== "production";

export const captureAsyncFunc = xRayIsActive
  ? (_name: string, callback: any) => callback({ close: () => {} })
  : XRay.captureAsyncFunc;
