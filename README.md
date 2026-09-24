# Irvan — Computational Architect & Software Engineer Portfolio

Website portofolio profesional, dinamis, dan responsif yang menggabungkan dua keahlian inti: **Desain Arsitektur Spasial** dan **Rekayasa Perangkat Lunak (Programming / WebGL / BIM)**.

---

## 🌟 Fitur Utama Website

1. **Dual Perspective Mode (Arsitek / Programmer / Hybrid)**:
   - Pengunjung dapat mengubah sudut pandang tampilan di navbar atas:
     - **Mode Hybrid**: Menyeimbangkan arsitektur fisik dan rekayasa kode secara harmonis.
     - **Mode Arsitek**: Menyesuaikan tema ke estetika studio arsitektur hangat (Timber & Amber), memfilter proyek fisik, dan menonjolkan tektonika materialitas.
     - **Mode Developer**: Menyesuaikan tema ke estetika Cyber Blueprint Neon & Terminal, memfilter proyek software/WebGL, dan menonjolkan arsitektur kode.

2. **Real-time 3D Parametric Pavilion (Three.js WebGL)**:
   - Viewport interaktif 3D di Hero section yang menampilkan struktur kanopi parametrik lengkung ganda dengan rotasi halus dan live HUD (Vertices, Angle, FPS).
   - Dapat dirotasi (orbit), di-zoom, dan digerakkan dengan mouse atau sentuhan jari.

3. **Interactive Parametric Studio Playground (The Lab)**:
   - Sandbox interaktif di mana pengunjung dapat mengontrol variabel geometri bangunan secara real-time:
     - **Sudut Puntir (Twist Angle)**: 0° s/d 360°
     - **Tinggi Lantai (Floor Levels)**: 6 s/d 48 Lantai
     - **Rasio Kelengkungan (Taper)**: Bentuk silinder vs melengkung meruncing
     - **Kepadatan Louver Parametrik**: Jumlah sirip fasad
     - **Pilihan Tampilan Material**: *Cyber Blueprint*, *Timber Gold*, *Bioclimatic Green*, dan *Minimalist Bauhaus*
     - **Wireframe vs Solid Shading**
     - **Auto-Spin & Reset Kamera 3D**
   - **Sinkronisasi Kode Live**: Setiap kali slider digerakkan, kode generator algoritma (Python Rhino/Grasshopper) ikut diperbarui secara real-time dengan tombol *1-Click Copy Code*!

4. **Portofolio & Studi Kasus Mendalam (Filterable & Modal)**:
   - Kategori filter: *Semua*, *Arsitektur Fisik*, *Software & WebGL*, *Generative & BIM*.
   - 6 Proyek unggulan dengan foto render ultra-realistis:
     1. **Paviliun Parametrik Nusantara** (Kayu Glulam Jati, Grasshopper Kangaroo)
     2. **Skyline Nexus: Bioclimatic Smart Skyscraper** (Menara 42 Lantai, Fasad Voronoi, Ladybug)
     3. **ArcGene: Generative CAD Web Studio** (Aplikasi WebGL 3D SaaS di browser)
     4. **Villa Kinanti: Tropical Brutalism** (Villa Mewah Uluwatu Bali & Otomasi ESP32 IoT)
     5. **SpatialTwin: Smart Building Dashboard** (Digital Twin 3D real-time dengan WebSockets)
     6. **RhinoToWeb: Geometry Pipeline CLI** (Tool konversi model Rhino 3D ke web glTF)
   - Setiap proyek memiliki modal detail yang mencakup tantangan, solusi algoritma, matriks efisiensi, dan spesifikasi teknologi.

5. **Interactive Terminal HUD (`>_ CLI`)**:
   - Pengunjung programmer atau klien teknologi dapat membuka terminal interaktif via tombol `>_ CLI` di navbar atau menekan tombol keyboard `~`.
   - Mendukung berbagai perintah interaktif: `help`, `about`, `projects`, `skills`, `blueprint`, `theme`, `calc [m²]`, `contact`, `clear`, hingga `sudo hire`.

6. **Web Audio Synthesizer**:
   - Efek suara micro-feedback interaktif berbasis Web Audio API asli (tanpa perlu file mp3 eksternal).
   - Dilengkapi tombol mute/unmute audio di pojok kanan bawah.

7. **Blueprint Drafting Grid Overlay**:
   - Tombol penggaris drafting arsitektur di pojok kanan bawah yang mengubah latar belakang menjadi grid milimeter presisi dengan koordinat teknis CAD.

8. **Formulir Kolaborasi Terintegrasi**:
   - Pemilihan jenis proyek (*Desain Arsitektur/Villa*, *Fasad Parametrik*, *Aplikasi Web 3D/BIM*, *Konsultasi*).
   - Terintegrasi langsung untuk membuka chat WhatsApp dengan pesan brief otomatis.

---

## 🚀 Cara Menjalankan Website

Website dibuat murni menggunakan teknologi standar web modern (**HTML5 + Vanilla CSS3 + Modern JavaScript ES6 + Three.js**), sehingga sangat cepat, ringan, dan dapat dibuka langsung di browser mana pun.

### Opsi 1: Menggunakan Local Server (Sudah Aktif)
Server lokal Node.js telah berjalan di port 3000. Buka URL berikut di browser Anda:
```
http://localhost:3000/
```

### Opsi 2: Membuka Langsung File HTML
Anda juga dapat membuka file secara langsung tanpa server:
```
d:\Dokumen irvan\PROGRAMING\WEB LOVABLE4\niaga4\index.html
```
Cukup klik dua kali (double click) pada file `index.html`.

---

## 📁 Struktur File Proyek

```
niaga4/
├── index.html          # Struktur halaman semantik & SEO-friendly
├── style.css           # Design system Vanilla CSS (Glassmorphism & Responsif)
├── app.js              # Logika Three.js 3D, Sandbox parametrik, Terminal CLI, Audio synth
├── server.js           # Server HTTP statis lokal Node.js
├── README.md           # Dokumentasi lengkap
└── assets/
    └── images/
        ├── arch_pavilion.jpg    # Foto render Paviliun Parametrik
        ├── smart_tower.jpg      # Foto render Bioclimatic Skyscraper
        ├── tropical_villa.jpg   # Foto render Villa Tropis Brutalis
        └── generative_cad_ui.jpg# Mockup UI Web CAD Studio
```
