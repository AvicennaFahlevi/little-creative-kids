# Little Creative Kids

Aplikasi edukasi Google Apps Script untuk tablet Android (usia 5 tahun).

## Fitur
- Melukis bebas dengan sentuhan, palet warna, pilihan kuas, penghapus, undo, dan PNG.
- Mewarnai gambar rumah, bunga, dan matahari.
- Tracing huruf alfabet A-Z.
- Tracing angka 0-9.

## Deploy Google Apps Script
Source di repository ini adalah **Google Apps Script**, bukan website statis GitHub Pages.
1. Buat project Apps Script, isi `Code.gs` dan buat file HTML bernama `Index` dari `Index.html`.
2. Deploy > New deployment > Web app.
3. Buka URL deployment `/exec` di tablet Android.

Catatan: GitHub tidak otomatis men-deploy project Apps Script. Untuk otomasi deployment langsung gunakan clasp + OAuth Google; koneksi GitHub saja tidak cukup. Suara menggunakan dukungan text-to-speech browser. Tracing belum menilai akurasi goresan, dan file PNG diunduh ke perangkat.
