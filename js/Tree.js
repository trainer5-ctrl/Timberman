class Tree {
    constructor(canvas, startX, startY) {
        this.canvas = canvas;
        this.startX = startX;
        this.startY = startY;
        this.ctx = canvas.getContext('2d');
        this.width = 100;
        this.height = 150;
        this.trees = [];
        this.treesPossibility = [0, "left", "right"];
        this.trunkColors = ['#a17438','#cc8e35'];
        this.stoneColor = '#7f8c8d';
        this.stemWidth = 100;
        this.stemHeight = 30;
        this.starterTree = 5;
    }

    init() {
        for(let i = 1; i <= this.starterTree; i++) {
            let newTrunk = this.treesPossibility[randomNumber(3)];
            let color = this.trunkColors[i % 2];
            this.trees.push({ value: newTrunk, color });
        }
    }

    createNewTrunk() {
        let lastColor = this.trees[this.trees.length - 1].color;
        let color = lastColor === this.trunkColors[0] ? this.trunkColors[1] : this.trunkColors[0];
        let newTrunk = this.treesPossibility[randomNumber(3)];
        this.trees.push({ value: newTrunk, color });
    }

    drawTrunk(x, y, width, height, color) {
        // Tambahkan gradien untuk batang agar lebih dramatis
        let grad = this.ctx.createLinearGradient(x, y, x, y + height);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "#5d3a1a"); // warna lebih gelap di bawah
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(x, y, width, height);

        // Tambahkan tekstur batang (garis vertikal tipis)
        this.ctx.strokeStyle = "#4b2e1a";
        this.ctx.lineWidth = 2;
        for(let i = 5; i < width; i += 15){
            this.ctx.beginPath();
            this.ctx.moveTo(x + i, y);
            this.ctx.lineTo(x + i + randomNumber(5)-2, y + height);
            this.ctx.stroke();
        }
    }

    drawLeaves(x, y, width) {
        // Tambahkan daun berbentuk lingkaran di batang dramatis
        let leafCount = randomNumber(3) + 2; // 2-4 daun
        for(let i = 0; i < leafCount; i++){
            let leafX = x + width/2 + (randomNumber(60)-30);
            let leafY = y - (randomNumber(50)+20);
            this.ctx.fillStyle = `rgba(46, 204, 113, ${0.6 + Math.random()*0.4})`;
            this.ctx.beginPath();
            this.ctx.ellipse(leafX, leafY, 20+randomNumber(10), 15+randomNumber(10), Math.PI/4, 0, 2*Math.PI);
            this.ctx.fill();
        }
    }

    draw() {
        let x = this.canvas.width / 2 - this.width / 2;

        this.trees.forEach((tree, index) => {
            let trunkY = this.startY - (index * this.height);
            this.drawTrunk(x, trunkY, this.width, this.height, tree.color);

            // Tambahkan ranting dramatis
            if(tree.value === 'left') {
                this.ctx.fillStyle = "#8e5a2c";
                this.ctx.roundRect(x - this.stemWidth, trunkY + this.height/2, this.stemWidth, this.stemHeight, {upperLeft:10, lowerLeft:10}, true, false);
                this.drawLeaves(x - this.stemWidth, trunkY + this.height/2, this.stemWidth);
            }
            if(tree.value === 'right') {
                this.ctx.fillStyle = "#8e5a2c";
                this.ctx.roundRect(x + this.width, trunkY + this.height/2, this.stemWidth, this.stemHeight, {upperRight:10, lowerRight:10}, true, false);
                this.drawLeaves(x + this.width, trunkY + this.height/2, this.stemWidth);
            }

            // Tambahkan daun utama di puncak batang
            if(index === this.trees.length - 1){
                this.drawLeaves(x, trunkY, this.width);
            }
        });

        // Batu dramatis di bawah pohon
        this.ctx.fillStyle = this.stoneColor;
        this.ctx.roundRect(x - 10, this.startY + this.height - 10, 50, 30, {upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10}, true, false);
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.roundRect(x + 20, this.startY + this.height - 10, 80, 30, {upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10}, true, false);
    }
}

// Fungsi randomNumber
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}
