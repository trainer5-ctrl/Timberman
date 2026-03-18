class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.image = new Image();
        this.image.src = "chara-removebg-preview.png"; // Nama file sesuai yang kamu unggah

        this.characterPosition = "right"; 
        this.characterWidth = 120; // Ukuran tampilan di canvas
        this.characterHeight = 120;

        // Atur koordinat agar karakter berada di kiri atau kanan pohon
        this.characterPositions = {
            left: { x: canvas.width / 2 - 150, y: canvas.height - 150 },
            right: { x: canvas.width / 2 + 30, y: canvas.height - 150 }
        };

        this.frameIndex = 0;
        this.numberOfFrames = 6; // Total pose dalam gambar chara.jpg
        this.tickCount = 0;
        this.ticksPerFrame = 4;  // Kecepatan ayunan kapak
        this.isAnimating = false;
    }

    // Fungsi ini dipanggil saat tombol diklik
    action(side) {
        this.characterPosition = side;
        this.frameIndex = 0;    // Mulai ayunan dari frame pertama
        this.isAnimating = true; // Aktifkan animasi
    }

    update() {
        if (!this.isAnimating) return;

        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                // Selesai mengayun, kembali ke frame 0 dan berhenti
                this.frameIndex = 0;
                this.isAnimating = false;
            }
        }
    }

    draw() {
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
        
        // Menghitung lebar satu frame (lebar total gambar / 6)
        const sw = this.image.width / this.numberOfFrames;
        const sh = this.image.height;

        this.ctx.save();

        // Jika posisi kanan, kita balik gambarnya (Flip Horizontal)
        if (this.characterPosition === 'right') {
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, // Mengambil frame ke-n secara horizontal
            sw, sh,                  
            pos.x, pos.y,            
            this.characterWidth, this.characterHeight 
        );

        this.ctx.restore();
    }
}
