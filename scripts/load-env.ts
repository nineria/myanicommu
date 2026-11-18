// Next.js reads .env.local on its own; plain scripts don't. Load it first (then .env as a fallback).
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });
