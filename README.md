# PPKA INDONESIA – MADE BY RAILWAYOP
Simulator PPKA 2D (HTML/CSS/JS murni, tanpa server, tanpa API). Simulasi edukasi fiktif; data ilustratif, bukan data resmi KAI.

## Menjalankan di Android
1. Ekstrak ZIP (Files by Google / ZArchive).
2. Buka `index.html` dengan Chrome (Bagikan > Chrome, atau ketik path file:///...).
   Alternatif: Termux -> `python -m http.server 8000` di folder ini, lalu buka http://localhost:8000.

## Cara main
- Ketuk kereta: info nama, nomor, kecepatan, target, status, stasiun berikut, ETA, keterlambatan, sinyal depan. Tombol: Ikuti, Tahan, Lanjutkan.
- Ketuk sinyal: atur Merah / Kuning / Hijau / Otomatis. Sinyal otomatis merah bila blok terisi, kuning bila sinyal berikutnya merah. Permintaan Kuning/Hijau yang tidak aman ditolak dengan alasan; Merah ditolak bila kereta sudah di jarak pengereman.
- Peta ringkas (atas): ketuk untuk melompat. Geser = pan, cubit = zoom. Kecepatan 1x–60x, Jeda, Reset.

## Struktur
index.html · css/style.css · js/data.js (jaringan & jenis KA) · js/engine.js (mesin, tanpa UI) · js/ui.js (kanvas & kontrol) · tests/sim.test.js (`node tests/sim.test.js`)

## Sudah ada
3 lintas (KRL Jakarta Kota–Bogor, Utara Jawa, Selatan Jawa) dua jalur, 49 stasiun, sinyal masuk/keluar/blok, 76+ kereta otomatis, 40 jenis KA (KRL, Eksekutif, Campuran, Ekonomi, Barang), formasi per jenis, fisika pengereman, jarak aman, jam WIB, log, papan kereta.
## Belum ada (butuh data/pekerjaan lanjutan)
Wesel/rute/persilangan & percabangan, jaringan Sumatra/Sulawesi, editor jadwal, insiden, asisten AI, simpan/impor, suara.
