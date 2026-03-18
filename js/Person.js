class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Load Gambar
        this.image = new Image();
        this.image.src = "images/character.png";

        // Posisi default
        this.characterPosition = "right";
        this.characterWidth = 80;  // Sesuaikan ukuran di layar
        this.characterHeight = 160; 

        this.positions = {
            left: { x: canvas.width / 2 - 140, y: canvas.height - 300 },
            right: { x: canvas.width / 2 + 60, y: canvas.height - 300 }
        };

        // --- Logika Animasi ---
        this.frameIndex = 0;
        this.numberOfFrames = 6; // Karena gambar Anda punya 6 pose
        this.tickCount = 0;
        this.ticksPerFrame = 8;  // Kecepatan gerak (kecil = makin cepat)
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
        }
    }

    draw() {
        if (!this.image.complete) return; // Tunggu gambar loading

        const pos = this.positions[this.characterPosition];
        const sw = this.image.width / this.numberOfFrames; // Lebar 1 potongan asli
        const sh = this.image.height;

        this.ctx.save();

        // Jika hadap kanan, kita balik gambarnya secara horizontal (mirror)
        if (this.characterPosition === 'right') {
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, // Potong gambar berdasarkan frameIndex
            sw, sh,                 // Ukuran asli potongan
            pos.x, pos.y,           // Posisi di kanvas
            this.characterWidth, this.characterHeight // Ukuran di kanvas
        );

        this.ctx.restore();
    }

    moveLeft() {
        this.characterPosition = 'left';
    }

    moveRight() {
        this.characterPosition = 'right';
    }
}
