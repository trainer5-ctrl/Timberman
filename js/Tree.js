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
        let grad = this.ctx.createLinearGradient(x, y, x, y + height);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "#5d3a1a");
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(x, y, width, height);

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
        let leafCount = randomNumber(3) + 2;
        for(let i = 0; i < leafCount; i++){
            let leafX = x + width/2 + (randomNumber(60)-30);
            let leafY = y - (randomNumber(50)+20);
            this.ctx.fillStyle = `rgba(46, 204, 113, ${0.6 + Math.random()*0.4})`;
            this.ctx.beginPath();
            this.ctx.ellipse(leafX, leafY, 20+randomNumber(10), 15+randomNumber(10), Math.PI/4, 0, 2*Math.PI);
            this.ctx.fill();
        }
    }

    // Fungsi helper: rectangle dengan sudut membulat
    roundRect(x, y, w, h, r) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    draw() {
        let x = this.canvas.width / 2 - this.width / 2;

        this.trees.forEach((tree, index) => {
            let trunkY = this.startY - (index * this.height);
            this.drawTrunk(x, trunkY, this.width, this.height, tree.color);

            // Ranting kiri
            if(tree.value === 'left') {
                this.ctx.fillStyle = "#8e5a2c";
                this.roundRect(x - this.stemWidth, trunkY + this.height/2, this.stemWidth, this.stemHeight, 10);
                this.drawLeaves(x - this.stemWidth, trunkY + this.height/2, this.stemWidth);
            }

            // Ranting kanan
            if(tree.value === 'right') {
                this.ctx.fillStyle = "#8e5a2c";
                this.roundRect(x + this.width, trunkY + this.height/2, this.stemWidth, this.stemHeight, 10);
                this.drawLeaves(x + this.width, trunkY + this.height/2, this.stemWidth);
            }

            // Daun puncak
            if(index === this.trees.length - 1){
                this.drawLeaves(x, trunkY, this.width);
            }
        });

        // Batu bawah pohon
        this.ctx.fillStyle = this.stoneColor;
        this.roundRect(x - 10, this.startY + this.height - 10, 50, 30, 10);
        this.ctx.fillStyle = '#95a5a6';
        this.roundRect(x + 20, this.startY + this.height - 10, 80, 30, 10);
    }
}

// Fungsi randomNumber
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}
