import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error("SUPABASE_URL missing in backend/.env");
if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing in backend/.env");

export const supabase = createClient(url, key);
