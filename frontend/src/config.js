// Alamat backend API dipusatkan di sini.
// - Di lokal: otomatis pakai http://localhost:5000 (backend lokal).
// - Di produksi (Vercel): kosong -> request relatif -> lewat proxy vercel.json
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");