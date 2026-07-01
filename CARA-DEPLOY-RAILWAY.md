# Panduan Deploy — Sistem Presensi Karyawan

Panduan ini melanjutkan versi kode yang **sudah disiapkan untuk online**. Beberapa
perubahan berikut sudah dikerjakan, jadi Anda tinggal ikuti langkah deploy.

## Yang sudah diubah dari versi asli

1. **`backend/config/db.js`** — koneksi database tidak lagi di-hardcode. Sekarang
   membaca dari environment variable (`DB_HOST`, `DB_PORT`, `DB_USER`,
   `DB_PASSWORD`, `DB_NAME`). Di komputer lokal tetap otomatis ke XAMPP.
2. **`frontend/src/config.js`** (file baru) — alamat backend dipusatkan di sini.
   Lokal otomatis `http://localhost:5000`; online mengikuti variabel `VITE_API_URL`.
3. **Semua file frontend** — ±20 alamat `http://localhost:5000` yang tadinya
   ditulis manual sudah diganti agar mengikuti `config.js`.
4. **`node_modules` dihapus** dari paket. WAJIB `npm install` ulang; folder lama
   berisi biner khusus Windows yang tidak jalan di server Linux.

Arsitektur yang direkomendasikan (paling hemat & mudah):

- **Railway** → backend (Node/Express) + database (MySQL)
- **Vercel** → frontend (React/Vite), gratis dan cocok untuk Vite

> Semuanya juga bisa di Railway; lihat catatan di bagian akhir.

---

## Langkah 1 — Push project ke GitHub

1. Buat repository baru (boleh privat) di GitHub, misalnya `sistem-presensi`.
2. Dari folder project, jalankan:
   ```bash
   git init
   git add .
   git commit -m "Versi siap deploy"
   git branch -M main
   git remote add origin https://github.com/USERNAME/sistem-presensi.git
   git push -u origin main
   ```
   `.gitignore` sudah mengecualikan `node_modules`, jadi ukuran repo tetap kecil.

---

## Langkah 2 — Buat database MySQL di Railway

1. Masuk ke https://railway.com, login pakai GitHub.
2. **New Project** → **Provision MySQL** (atau tombol **+ New → Database → MySQL**).
3. Setelah jadi, klik service **MySQL** → tab **Variables**. Di sana ada:
   `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.
   Nilai-nilai ini dipakai di Langkah 4.

### Import `presensi.sql` ke MySQL Railway

Cara termudah lewat komputer Anda memakai TCP Proxy Railway:

1. Di service MySQL Railway → tab **Connect** → salin host & port proxy publik.
2. Dari terminal (butuh MySQL client terpasang; XAMPP sudah punya `mysql`):
   ```bash
   mysql -h HOST_PROXY -P PORT_PROXY -u root -p railway < presensi.sql
   ```
   Masukkan password dari `MYSQLPASSWORD`. Nama database bawaan Railway adalah
   `railway` (bukan `presensi`) — itu wajar, cukup pakai nama itu.

> Alternatif tanpa terminal: sambungkan HeidiSQL / DBeaver / phpMyAdmin ke host &
> port proxy Railway, lalu import `presensi.sql` seperti biasa.

---

## Langkah 3 — Deploy backend di Railway

1. Di project yang sama → **+ New** → **GitHub Repo** → pilih repo Anda.
2. Buka service backend → **Settings** → **Root Directory** → isi `backend`.
   (Penting, karena repo berisi dua folder: `backend` dan `frontend`.)
3. Railway otomatis mendeteksi Node.js dan menjalankan `npm start` (`node app.js`).

---

## Langkah 4 — Set environment variable backend

Di service backend → tab **Variables**, tambahkan (pakai referensi ke service MySQL):

| Variable      | Value                          |
|---------------|--------------------------------|
| `DB_HOST`     | `${{ MySQL.MYSQLHOST }}`        |
| `DB_PORT`     | `${{ MySQL.MYSQLPORT }}`        |
| `DB_USER`     | `${{ MySQL.MYSQLUSER }}`        |
| `DB_PASSWORD` | `${{ MySQL.MYSQLPASSWORD }}`    |
| `DB_NAME`     | `${{ MySQL.MYSQLDATABASE }}`    |
| `JWT_SECRET`  | (buat string acak panjang)     |

`PORT` **tidak perlu** diisi — Railway mengaturnya otomatis dan kode sudah pakai
`process.env.PORT`.

Setelah variabel disimpan, Railway redeploy. Cek tab **Deploy Logs** — harus muncul
`MySQL Connected` dan `Server running on port ...`.

### Buat URL publik backend

Service backend → **Settings** → **Networking** → **Generate Domain**. Anda akan
dapat URL seperti `https://backend-anda.up.railway.app`. **Simpan URL ini.**

Tes: buka URL tersebut di browser, harus muncul `{"message":"Backend Presensi Berjalan"}`.

---

## Langkah 5 — Deploy frontend di Vercel

1. Masuk ke https://vercel.com, login pakai GitHub, **Add New → Project**, pilih repo.
2. Saat konfigurasi:
   - **Root Directory**: `frontend`
   - Framework Preset: **Vite** (biasanya terdeteksi otomatis)
3. Buka **Environment Variables**, tambahkan:
   - Name: `VITE_API_URL`
   - Value: URL backend dari Langkah 4 (mis. `https://backend-anda.up.railway.app`)
4. **Deploy**. Setelah selesai, Anda dapat URL frontend — itulah alamat website
   presensi Anda yang online.

> Penting: `VITE_API_URL` dibaca saat **build**. Kalau URL backend diubah, lakukan
> **Redeploy** di Vercel agar terpasang ulang.

---

## Selesai — cara pakai

- Buka URL frontend dari Vercel.
- Daftar akun lewat halaman Register, lalu (kalau perlu admin) ubah kolom `role`
  akun menjadi `admin` di database (lewat HeidiSQL/DBeaver ke MySQL Railway).

---

## Catatan penting

- **Foto upload bersifat sementara.** Backend menyimpan foto profil di folder lokal
  `uploads/`. Di Railway, penyimpanan file bersifat *ephemeral* — file hilang setiap
  redeploy. Untuk demo/skripsi ini biasanya tidak masalah. Kalau butuh permanen,
  perlu storage terpisah (mis. Cloudinary/S3) — bisa dibahas terpisah.
- **Biaya Railway.** Tidak ada free tier permanen. Ada kredit trial ± $5, lalu paket
  Hobby minimal $5/bulan. Untuk demo singkat, kredit trial umumnya cukup.
- **Ingin semuanya di Railway (tanpa Vercel)?** Bisa. Tambah satu service dari repo
  yang sama dengan Root Directory `frontend`, lalu ubah start agar menyajikan hasil
  build statis (mis. `npm run build` + `npx serve dist`). Vercel dipilih di panduan
  ini karena gratis dan lebih ringkas untuk Vite.
