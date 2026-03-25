class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Memuat gambar
        this.image = new Image();
        this.image.src = "images/chara-removebg-preview.png";

        // Status Posisi
        this.characterPosition = "right";
        this.characterWidth = 90; // Ukuran sedikit disesuaikan agar pas
        this.characterHeight = 150;

        // Posisi X & Y agar pas dengan batang pohon
        this.characterPositions = {
            left: { x: canvas.width / 2 - 170, y: canvas.height - 330 },
            right: { x: canvas.width / 2 + 40, y: canvas.height - 330 }
        };

        // --- Logika Animasi Sekali Jalan (Jumping) ---
        this.frameIndex = 0; // Frame aktif (0-5)
        this.numberOfFrames = 6; // Total ada 6 frame di sprite sheet
        this.tickCount = 0; // Penghitung waktu
        this.ticksPerFrame = 6; // Kecepatan animasi (kecil = makin cepat)
        
        // KUNCI: Status apakah sedang melompat
        this.isJumping = false; 
    }

    // Fungsi untuk memicu animasi lompat
    startJump() {
        this.isJumping = true;
        this.frameIndex = 0; // Mulai dari frame pertama
        this.tickCount = 0;
    }

    // Fungsi update hanya berjalan JIKA isJumping true
    update() {
        if (!this.isJumping) return; // Diam di frame 0 jika tidak melompat

        this.tickCount++;
        
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            // Maju ke frame berikutnya
            this.frameIndex++;
            
            // JIKA sudah frame terakhir, matikan status lompat
            if (this.frameIndex >= this.numberOfFrames) {
                this.isJumping = false;
                this.frameIndex = 0; // Kembali diam di frame pertama
            }
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
            pos.x, pos.y,            // Posisi di kanvas
            this.characterWidth, this.characterHeight // Ukuran di kanvas
        );

        this.ctx.restore();
    }
}
