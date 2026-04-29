import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "https://gregarious-fish-792.convex.cloud");

const translations = {
  "cyclistProfile.loading": "Memuatkan Profil...",
  "cyclistProfile.load_error": "Sambungan Terputus",
  "cyclistProfile.load_error_desc": "Tidak dapat memuatkan profil ini. Sila periksa sambungan anda dan cuba lagi.",
  "cyclistProfile.retry": "Cuba Lagi",
  "cyclistProfile.not_found": "Profil penunggang ini tidak wujud atau telah dibuang.",
  "cyclistProfile.view_all_riders": "← Lihat Semua Penunggang",
  "cyclistProfile.back": "Kembali",
  "cyclistProfile.sab_rider_label": "Penunggang SAB 2026",
  "cyclistProfile.location_label": "Borneo 2026",
  "cyclistProfile.goal_label": "Matlamat",
  "cyclistProfile.featured_label": "Penunggang Pilihan",
  "cyclistProfile.raised_label": "Terkumpul",
  "cyclistProfile.reached_suffix": "% Dicapai",
  "cyclistProfile.their_story": "KISAH MEREKA",
  "cyclistProfile.gallery": "GALERI",
  "cyclistProfile.about_the_ride": "TENTANG KAYUHAN",
  "cyclistProfile.distance_label": "JARAK",
  "cyclistProfile.distance_value": "680 KM",
  "cyclistProfile.days_label": "HARI",
  "cyclistProfile.days_value": "6",
  "cyclistProfile.route_label": "LALUAN",
  "cyclistProfile.route_value": "KK → Miri",
  "cyclistProfile.date_label": "TARIKH",
  "cyclistProfile.date_value": "Jul 2026",
  "cyclistProfile.support_prefix": "SOKONG",
  "cyclistProfile.donate_desc": "Sumbangan anda secara langsung menyokong matlamat kutipan dana penunggang ini dan membiayai penjagaan pediatrik yang menyelamatkan nyawa.",
  "cyclistProfile.donate_now": "DERMA SEKARANG",
  "cyclistProfile.or_general_fund": "Atau derma ke Dana Umum",
  "cyclistProfile.share_profile": "KONGSI PROFIL",
  "cyclistProfile.link_copied": "Pautan Disalin!",
  "cyclistProfile.see_all_riders": "Lihat Semua Penunggang"
};

async function main() {
  for (const [key, value] of Object.entries(translations)) {
    console.log(`Setting ${key}...`);
    await client.mutation(api.translations.upsertKey, { lang: "ms", key, value });
  }
  console.log("Done!");
}

main().catch(console.error);
