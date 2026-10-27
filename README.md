# Little Creative Kids

Ruang bermain edukatif berbahasa Indonesia untuk anak usia 4–6 tahun. Google Apps Script adalah platform utama; `index.html` juga dibangun dari sumber yang sama untuk GitHub Pages dan pengujian lokal. Tidak ada iklan, analitik pihak ketiga, akun anak, atau informasi pribadi anak yang diminta.

## Fitur MVP

- **Melukis:** 12 warna, pensil/krayon/spidol, 3 ukuran kuas, penghapus, undo/redo, konfirmasi kertas baru, PNG, dan melanjutkan gambar lokal.
- **Mewarnai:** 13 ilustrasi SVG (kucing, anjing, ikan, kupu-kupu, gajah, bunga, pohon, matahari, pelangi, rumah, mobil, balon, es krim), wilayah ber-ID unik, undo/redo, reset, hadiah visual, serta ekspor PNG.
- **Huruf A–Z:** pengenalan dan kata contoh, panduan titik awal/arah/urutan, demonstrasi animasi, latihan mengikuti garis, dan menulis mandiri. Pemeriksaan geometri menggunakan jalur goresan yang sebenarnya; menekan Periksa saja tidak menghasilkan keberhasilan.
- **Angka 0–9:** pengenalan, menulis dengan/tanpa panduan, menghitung objek, dan mencocokkan jumlah dengan pilihan angka.
- **Orang tua:** gerbang penjumlahan untuk mencegah masuk tanpa sengaja (bukan autentikasi), progres lokal, galeri, unduh ulang, audio, hapus data lokal, dan opsi salinan karya baru ke Drive.
- **Audio:** speech synthesis dengan suara `id-ID` jika tersedia, pesan visual jika tidak tersedia, nada apresiasi lembut, dan mute yang disimpan lokal. Suara hanya dipicu interaksi pengguna.

## Struktur

`Code.gs` melayani `Shell.html` melalui HtmlService template. `Styles`, `Utilities`, `References`, `Audio`, `Drawing`, `Coloring`, `Alphabet`, `Numbers`, dan `App` adalah partial HTML tepercaya. `Config.gs` dan `Storage.gs` mengatur salinan Drive dengan validasi di server. Progres, galeri Blob PNG, dan draft menggunakan IndexedDB; goresan dan animasi berjalan di browser, tanpa API backend pada setiap gerakan jari.

`Shell.html` menggantikan `Index.html` agar tidak bertabrakan dengan `index.html` pada Windows. Jangan mengedit `index.html` langsung: jalankan `npm run build` setelah mengubah partial. Folder `tools/` dan `tests/` berisi tooling Node, bukan arsitektur JavaScript aplikasi Apps Script.

## Menjalankan dan menguji

```sh
npm install
npm run build
npm run check
npm test
npm run serve
# Terminal lain; Google Chrome harus terpasang:
npm run test:browser
```

Pratinjau: `http://127.0.0.1:4173`. Pengujian lengkap, hasil, batasan, dan checklist tablet: [docs/QA.md](docs/QA.md). Workflow GitHub menjalankan static checks, unit tests, build parity, dan pengujian Chromium.

## Google Apps Script

Status aktual proyek dan deployment dicatat di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). GitHub Pages tidak memperbarui runtime Apps Script secara otomatis.

1. Gunakan `clasp` dengan akun Google yang berwenang. Jangan commit file OAuth atau `.clasp.json` lokal.
2. Hubungkan proyek yang benar menggunakan `clasp clone <scriptId>` pada folder terpisah atau buat `.clasp.json` lokal dengan `scriptId` dan `rootDir: "."`. `.claspignore` hanya memilih 14 file aplikasi; periksa `clasp show-file-status` sebelum upload.
3. `clasp push`, lalu `clasp create-deployment --description "Little Creative Kids"`.
4. Manifest menggunakan **USER_ACCESSING** dan **MYSELF** untuk deployment awal yang privat. Masuk memakai akun pemilik deployment dan setujui scope aplikasi. Jangan mengganti ke execute-as-owner untuk aplikasi bersama.
5. Untuk pembaruan, push kemudian `clasp update-deployment <deploymentId>`. Deployment versi lama tidak otomatis mengikuti HEAD.
6. Jika memakai editor manual, tambahkan file `.gs`, semua partial HTML, dan manifest; deploy sebagai Web App dengan pengguna yang mengakses aplikasi. Aktifkan Advanced Drive Service v3 jika diminta.

Layanan Drive v3 memakai scope `drive.file`, sehingga hanya file yang dibuat/diakses aplikasi melalui izin tersebut yang tersedia. Scope identitas email hanya dipakai server untuk memastikan pengguna aktif sama dengan identitas eksekusi; tidak dicatat sebagai data anak. Karena izin Apps Script berlaku pada tingkat proyek, izin Drive dapat diminta saat membuka deployment walaupun salinan cloud masih mati. Tidak ada upload karya sampai fitur dinyalakan di area orang tua.

Folder karya dibuat server pada Drive pengguna yang memberi izin; browser tidak pernah menentukan folder ID. PNG maksimal 3 MiB, dimensi maksimal 4096×4096 dan 9 juta piksel, nama unik, tanpa overwrite, serta pembatasan jeda upload. Token OAuth tidak dikirim ke browser. Gerbang orang tua tidak menggantikan izin akun Google. Mematikan salinan Drive tidak menghapus file yang sudah tersimpan di sana. Mode statis tidak menyediakan salinan Drive.

## Batasan rilis

Huruf kecil belum tersedia. Pemeriksaan mengikuti model urutan/direksi goresan yang ditampilkan, bukan pengenalan tulisan tangan umum. Kalibrasi dengan anak dan pemeriksaan di tablet Android nyata belum dilakukan. Penyimpanan browser dapat dihapus sistem/pengguna; unduh PNG sebagai cadangan. Tidak ada sinkronisasi draft atau progres antarperangkat. Browser harus memuat halaman awal lewat internet; permainan yang sudah dimuat tidak memerlukan API selama kegiatan. Dukungan suara, download iframe, dan izin Drive bergantung pada perangkat serta akun.
