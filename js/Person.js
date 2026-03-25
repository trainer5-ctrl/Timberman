class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Load image
        this.image = new Image();
        this.image.src = "images/chara-removebg-preview.png";

        // Status posisi
        this.characterPosition = "right";

        // Ukuran karakter
        this.characterWidth = 90;
        this.characterHeight = 170;

        // 🔥 POSISI DINAMIS (INI KUNCINYA)
        this.offsetX = 50; // geser ke kanan 50px
        this.x = canvas.width / 2 + this.offsetX;
        this.y = canvas.height - 300;

        // --- Animasi ---
        this.frameIndex = 0;
        this.numberOfFrames = 6;
        this.tickCount = 0;
        this.ticksPerFrame = 6;
        this.isJumping = false;
    }

    startJump() {
        this.isJumping = true;
        this.frameIndex = 0;
        this.tickCount = 0;
    }

    update() {
        if (!this.isJumping) return;

        this.tickCount++;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;

            if (this.frameIndex >= this.numberOfFrames) {
                this.isJumping = false;
                this.frameIndex = 0;
            }
        }
    }

    draw() {
        // ❗ proteksi gambar rusak / belum load
        if (!this.image.complete || this.image.naturalWidth === 0) return;

        const sw = this.image.width / this.numberOfFrames;
        const sh = this.image.height;

        this.ctx.save();

        // 🔥 FLIP KANAN
        if (this.characterPosition === 'right') {
            this.ctx.translate(this.x + this.characterWidth / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(this.x + this.characterWidth / 2), 0);
        }

        this.ctx.drawImage(
            this.image,
            this.frameIndex * sw, 0,
            sw, sh,
            this.x, this.y,
            this.characterWidth, this.characterHeight
        );

        this.ctx.restore();
    }
}
