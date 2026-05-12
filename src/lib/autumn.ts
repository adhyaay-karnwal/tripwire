import { Autumn } from "autumn-js";

if (process.env.NODE_ENV === "production" && !process.env.AUTUMN_SECRET_KEY) {
  throw new Error("AUTUMN_SECRET_KEY is required in production");
}

export const autumn = new Autumn({
  secretKey: process.env.AUTUMN_SECRET_KEY,
});
