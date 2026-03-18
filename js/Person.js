class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.image = new Image();
        this.image.src = "images/chara.png"; // Nama file baru Anda

        this.characterPosition = "right";
        this.characterWidth = 120; // Ukuran sedikit lebar karena ada ayunan kapak
        this.characterHeight = 160;

        this.groundY = canvas.height - 300;

        // Posisi X diatur agar mata kapak mengenai pohon saat frame mengayun
        this.characterPositions = {
            left: { x: canvas.width / 2 - 190 },
            right: { x: canvas.width / 2 + 70 }
        };

        this.frameIndex = 0;
        this.numberOfFrames = 6; // Tetap 6 frame sesuai gambar baru
        this.tickCount = 0;
        this.ticksPerFrame = 4; // Lebih cepat agar tebasan terasa bertenaga
        
        this.isChopping = false;
    }

    startChop() {
        this.isChopping = true;
        this.frameIndex = 0;
        this.tickCount = 0;
    }

    update() {
        if (!this.isChopping) {
            this.frameIndex = 5; // Posisi diam (idle) menggunakan frame terakhir
            return;
        }

        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            
            if (this.frameIndex >= this.numberOfFrames) {
                this.isChopping = false;
                this.frameIndex = 5; 
            }
        }
    }

    draw() {
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
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
            this.frameIndex * sw, 0,
            sw, sh,
            pos.x, this.groundY,
            this.characterWidth, this.characterHeight
        );

        this.ctx.restore();
    }
}
