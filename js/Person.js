class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Memuat gambar
        this.image = new Image();
        this.image.src = "images/character.png";

        // Status Posisi
        this.characterPosition = "right"; // Posisi target ('left' / 'right')
        this.characterWidth = 90; 
        this.characterHeight = 170;

        // Koordinat dasar di tanah
        this.groundY = canvas.height - 320;

        // Posisi X tanah agar pas dengan batang pohon
        this.characterPositions = {
            left: { x: canvas.width / 2 - 170 },
            right: { x: canvas.width / 2 + 80 }
        };

        // --- Logika Animasi Lompatan Presisi ---
        this.frameIndex = 0; // Frame aktif (0-5)
        this.numberOfFrames = 6; // Total ada 6 frame di sprite sheet
        this.tickCount = 0; // Penghitung waktu
        this.ticksPerFrame = 5; // Kecepatan animasi (sedikit dipercepat untuk presisi)
        
        // KUNCI: Status dan tinggi lompatan
        this.isJumping = false; 
        this.currentOffsetY = 0; // Ketinggian saat ini dari tanah
        this.maxJumpHeight = 110; // Ketinggian maksimal lompatan (piksel)

        // Simpan posisi X sebelumnya untuk interpolasi (jika ingin lebih advance)
        // Namun, berpindah instan lebih akurat untuk gameplay Lumberjack.
    }

    // Fungsi untuk memicu animasi lompat dari Lumberjack.js
    startJump() {
        this.isJumping = true;
        this.frameIndex = 0; // Mulai dari frame pertama
        this.tickCount = 0;
        this.currentOffsetY = 0; // Reset ketinggian
    }

    // Fungsi update untuk menghitung frame dan posisi Y
    update() {
        // Jika tidak melompat, diam di frame 0 dan di tanah
        if (!this.isJumping) {
            this.frameIndex = 0;
            this.currentOffsetY = 0;
            return;
        }

        this.tickCount++;
        
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            // Maju ke frame berikutnya
            this.frameIndex++;
            
            // JIKA sudah frame terakhir, matikan status lompat
            if (this.frameIndex >= this.numberOfFrames) {
                this.isJumping = false;
                this.frameIndex = 0; // Kembali diam
                this.currentOffsetY = 0; // Kembali ke tanah
            }
        }

        // --- HITUNG KETINGGIAN (Y) PRESISI (Curve Parabola) ---
        if (this.isJumping) {
            // Kita buat kurva parabola berdasarkan frame aktif.
            // Frame 0: Tanah, Frame 3: Puncak, Frame 5: Tanah
            // Rumus: offsetY = sin( progress * pi ) * maxHeight
            
            // Progress lompatan dari 0.0 sampai 1.0
            const jumpProgress = this.frameIndex / (this.numberOfFrames - 1);
            
            // Gunakan kurva Sinus untuk gerakan naik-turun yang halus
            // Ketinggian dihitung dengan: sin(pi * progress) * maxHeight
            const curveFactor = Math.sin(Math.PI * jumpProgress);
            
            // Kalikan dengan tinggi maksimal, pastikan nilainya positif
            this.currentOffsetY = curveFactor * this.maxJumpHeight;
        }
    }

    draw() {
        // Proteksi jika gambar belum load
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
        
        // Hitung lebar satu frame asli dari gambar source
        const sw = this.image.width / this.numberOfFrames; 
        const sh = this.image.height;

        this.ctx.save();

        // --- Logika Posisi Y Presisi ---
        // Kita menggambar di: groundY - currentOffsetY
        // offsetY bertambah (lompat ke atas), posisi Y kanvas berkurang.
        const drawY = this.groundY - this.currentOffsetY;

        // Balik karakter jika hadap kanan
        if (this.characterPosition === 'right') {
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, // Potong gambar berdasarkan frameIndex
            sw, sh,                  // Ukuran asli potongan
            pos.x, drawY,            // Posisi di kanvas (menggunakan drawY baru)
            this.characterWidth, this.characterHeight // Ukuran di kanvas
        );

        this.ctx.restore();
    }
}
