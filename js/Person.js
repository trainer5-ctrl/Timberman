class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.image = new Image();
        this.image.src = "images/character.png";

        this.characterPosition = "right";
        this.characterWidth = 100; // Ukuran sedikit diperbesar agar proporsional
        this.characterHeight = 160;

        // Sesuaikan posisi X agar pas dengan batang pohon
        this.characterPositions = {
            left: { x: canvas.width / 2 - 170, y: canvas.height - 320 },
            right: { x: canvas.width / 2 + 70, y: canvas.height - 320 }
        };

        this.frameIndex = 0;
        this.numberOfFrames = 6;
        this.tickCount = 0;
        this.ticksPerFrame = 6; // Angka lebih kecil = animasi lebih cepat
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
        }
    }

    draw() {
        // Pastikan gambar sudah load
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
        const sw = this.image.width / this.numberOfFrames;
        const sh = this.image.height;

        this.ctx.save();

        if (this.characterPosition === 'right') {
            // Balik karakter secara horizontal di titik koordinatnya
            this.ctx.translate(pos.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(pos.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0, 
            sw, sh,                 
            pos.x, pos.y,           
            this.characterWidth, this.characterHeight 
        );

        this.ctx.restore();
    }
}
