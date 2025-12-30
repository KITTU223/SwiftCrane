import { Polar } from "@polar-sh/sdk";
import { access } from "fs";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});
