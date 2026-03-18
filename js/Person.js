class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Memuat gambar
        this.image = new Image();
        this.image.src = "images/character.png";

        // Status Posisi
        this.characterPosition = "right"; // Posisi target ('left' / 'right')
        this.characterWidth = 95; // Sedikit diperbesar agar pas dengan pohon
        this.characterHeight = 170;

        // Koordinat dasar di tanah
        this.groundY = canvas.height - 300;

        // Posisi X tanah agar pas dengan batang pohon
        this.characterPositions = {
            left: { x: canvas.width / 2 - 180 },
            right: { x: canvas.width / 2 + 80 }
        };

        // --- Logika Animasi Menebang Pohon (Sekali Jalan) ---
        this.frameIndex = 0; // Frame aktif (0-5)
        this.numberOfFrames = 6; // Total ada 6 frame di sprite sheet
        this.tickCount = 0; // Penghitung waktu
        this.ticksPerFrame = 5; // Kecepatan animasi (sedikit dipercepat untuk presisi)
        
        // KUNCI: Status dan jarak menerjang
        this.isChopping = false; 
        this.currentOffsetX = 0; // Keterjangan ke samping dari posisi dasar
        this.maxChopLunge = 50; // Jarak menerjang maksimal (piksel)
    }

    // Fungsi untuk memicu animasi menerjang dari Lumberjack.js
    startChop() {
        this.isChopping = true;
        this.frameIndex = 0; // Mulai dari frame pertama
        this.tickCount = 0;
        this.currentOffsetX = 0; // Reset keterjangan
    }

    // Fungsi update untuk menghitung frame dan posisi X (keterjangan)
    update() {
        // Jika tidak memukul, diam di frame 0 dan di posisi dasar
        if (!this.isChopping) {
            this.frameIndex = 0;
            this.currentOffsetX = 0;
            return;
        }

        this.tickCount++;
        
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            // Maju ke frame berikutnya
            this.frameIndex++;
            
            // JIKA sudah frame terakhir, matikan status menerjang
            if (this.frameIndex >= this.numberOfFrames) {
                this.isChopping = false;
                this.frameIndex = 0; // Kembali diam
                this.currentOffsetX = 0; // Kembali ke posisi dasar
            }
        }

        // --- HITUNG KETERJANGAN (X) PRESISI ---
        if (this.isChopping) {
            // Kita gunakan kurva Sinus untuk gerakan menerjang yang bertenaga
            // Progress lompatan dari 0.0 sampai 1.0
            const progress = this.frameIndex / (this.numberOfFrames - 1);
            
            // Keterjangan maksimal dihitung dengan: sin(pi * progress) * maxHeight
            const curveFactor = Math.sin(Math.PI * progress);
            
            // Kalikan dengan jarak menerjang maksimal
            this.currentOffsetX = curveFactor * this.maxChopLunge;
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

        // --- Logika Posisi X Presisi (Menerjang) ---
        let drawX = pos.x;

        // Jika hadap kanan, keterjangan (currentOffsetX) harus mengurangi koordinat X
        if (this.characterPosition === 'right') {
            drawX = pos.x - this.currentOffsetX;
        } else {
            // Jika hadap kiri, keterjangan (currentOffsetX) harus menambah koordinat X
            drawX = pos.x + this.currentOffsetX;
        }

        // Balik karakter jika hadap kanan
        if (this.characterPosition === 'right') {
            this.ctx.translate(drawX + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(drawX + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, // Potong gambar berdasarkan frameIndex
            sw, sh,                  // Ukuran asli potongan
            drawX, this.groundY,     // Posisi di kanvas (menggunakan drawX baru)
            this.characterWidth, this.characterHeight // Ukuran di kanvas
        );

        this.ctx.restore();
    }
}
