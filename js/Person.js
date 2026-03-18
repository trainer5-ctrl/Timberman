class Person {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.image = new Image();
        this.image.src = "images/chara.png"; // Pastikan path file benar

        this.characterPosition = "right"; // Posisi awal
        this.characterWidth = 100; 
        this.characterHeight = 160;

        this.characterPositions = {
            left: { x: canvas.width / 2 - 170, y: canvas.height - 320 },
            right: { x: canvas.width / 2 + 70, y: canvas.height - 320 }
        };

        this.frameIndex = 0;
        this.numberOfFrames = 6;
        this.tickCount = 0;
        this.ticksPerFrame = 4; // Sedikit lebih cepat agar terasa responsif
        this.isAnimating = false;
    }

    // Fungsi untuk memicu gerakan
    move(side) {
        this.characterPosition = side;
        this.frameIndex = 0; // Reset ke frame pertama setiap kali klik
        this.tickCount = 0;
        this.isAnimating = true; 
    }

    update() {
        if (!this.isAnimating) return;

        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            // Jika sudah mencapai frame terakhir, hentikan animasi
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                this.frameIndex = 0; // Kembali ke posisi siap
                this.isAnimating = false; // Berhenti mengayun
            }
        }
    }

    draw() {
        if (!this.image.complete) return;

        let pos = this.characterPositions[this.characterPosition];
        const sw = this.image.width / this.numberOfFrames;
        const sh = this.image.height;

        this.ctx.save();

        // Logika membalikkan badan (Flip)
        // Kita balikkan jika di posisi 'left' atau 'right' tergantung selera arah gambar asli
        if (this.characterPosition === 'right') {
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
