// Alamat backend API dipusatkan di sini.
// - Di lokal: otomatis pakai http://localhost:5000 (backend lokal).
// - Di produksi (Railway/Vercel): set variabel VITE_API_URL ke URL backend online.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
