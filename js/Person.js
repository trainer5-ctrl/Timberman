class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Memuat gambar sekali saja di constructor
        this.image = new Image();
        this.image.src = "images/character.png";

        this.characterPosition = "right";
        this.characterPositions = {
            left: { x: canvas.width/2 - 160, y: canvas.height - 320 },
            right: { x: canvas.width/2 + 80, y: canvas.height - 320 }
        };

        this.characterWidth = 75;
        this.characterHeight = 150;

        // --- Logika Animasi ---
        this.frameIndex = 0; // Frame aktif (0-5)
        this.numberOfFrames = 6; // Total ada 6 karakter di gambar
        this.tickCount = 0; // Penghitung waktu
        this.ticksPerFrame = 10; // Kecepatan animasi (semakin besar semakin lambat)
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // Loop frame dari 0 ke 5, lalu kembali ke 0
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
        }
    }

    draw() {
        let pos = this.characterPositions[this.characterPosition];
        
        // Hitung lebar satu frame asli dari gambar source
        const sw = this.image.width / this.numberOfFrames; 
        const sh = this.image.height;

        this.ctx.save();

        if (this.characterPosition === 'right') {
            // Membalik karakter secara horizontal
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        // DrawImage parameter: (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, // Posisi X di sprite sheet (bergeser sesuai frame)
            sw, sh,                  // Ukuran potongan source
            pos.x, pos.y,            // Posisi di canvas
            this.characterWidth, this.characterHeight // Ukuran di canvas
        );

        this.ctx.restore();
    }

    moveLeft() {
        this.characterPosition = 'left';
        this.update(); // Jalankan update saat bergerak
    }

    moveRight() {
        this.characterPosition = 'right';
        this.update(); // Jalankan update saat bergerak
    }
}
