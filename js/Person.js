class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.image = new Image();
        // SESUAIKAN: Path file dari index.html ke folder images
        this.image.src = "images/chara-removebg-preview.png"; 

        this.characterPosition = "right"; 
        this.characterWidth = 100; // Ukuran tampilan di canvas
        this.characterHeight = 110; // Sedikit lebih pendek karena teks di bawah gambar asli

        // SESUAIKAN: Atur posisi agar pas dengan Tree.js kamu
        this.characterPositions = {
            left: { x: canvas.width / 2 - 130, y: canvas.height - 130 },
            right: { x: canvas.width / 2 + 30, y: canvas.height - 130 }
        };

        // Karena lebar frame di chara-removebg-preview.png tidak seragam,
        // kita definisikan posisi X manual untuk setiap frame.
        this.framesX = [
            0,    // Frame 1 (Angkat Kapak Tinggi)
            110,  // Frame 2 (Mulai Ayun Balik)
            218,  // Frame 3 (Ayun Depan)
            345,  // Frame 4 (Kena Kayu, Ada Partikel)
            465,  // Frame 5 (Kapak di Bawah)
            575   // Frame 6 (Posisi Siap)
        ];
        
        // Lebar pemotongan kasar untuk setiap frame
        this.frameWidths = [110, 108, 127, 120, 110, 110];

        this.frameIndex = 0;
        this.numberOfFrames = 6;
        this.tickCount = 0;
        this.ticksPerFrame = 4; // Sedikit lebih cepat agar responsif
        this.isAnimating = false;
    }

    // Fungsi yang dipanggil saat tombol diklik
    action(side) {
        // Reset state untuk ayunan baru
        this.characterPosition = side;
        this.frameIndex = 0; // Mulai dari pose angkat kapak
        this.isAnimating = true; 
    }

    update() {
        if (!this.isAnimating) return;

        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                // Selesai mengayun, kembali ke pose siap (frame 5) dan berhenti
                this.frameIndex = 5; 
                this.isAnimating = false;
            }
        }
    }

    draw() {
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
        
        // Menggunakan data manual karena frame tidak seragam
        const sx = this.framesX[this.frameIndex];
        const sw = this.frameWidths[this.frameIndex]; 
        const sh = this.image.height - 25; // Potong 25px dari bawah untuk hilangkan teks

        this.ctx.save();

        // Balik karakter jika berada di sisi kanan agar menghadap pohon
        if (this.characterPosition === 'right') {
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            sx, 0, // Posisi X manual dari array framesX
            sw, sh, // Lebar manual dan tinggi yang sudah dipotong
            pos.x, pos.y,            
            this.characterWidth, this.characterHeight 
        );

        this.ctx.restore();
    }
}
