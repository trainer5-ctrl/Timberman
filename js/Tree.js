class Tree {
    constructor(canvas, startX, startY) {
        this.canvas = canvas;
        this.startX = startX;
        this.startY = startY;
        this.ctx = canvas.getContext('2d');
        this.width = 100;
        this.height = 150;
        this.trees = [];
        this.treesPossibility = [0,"left","right"];
        this.trunkColors = ['#a17438','#cc8e35'];
        this.stoneColor = 'grey';
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
        let lastColor = this.trees[this.trees.length-1].color;
        let color = lastColor === this.trunkColors[0] ? this.trunkColors[1] : this.trunkColors[0];
        let newTrunk = this.treesPossibility[randomNumber(3)];
        this.trees.push({ value: newTrunk, color });
    }

    // Fungsi helper untuk rectangle dengan sudut membulat
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
        let x = this.canvas.width/2 - this.width/2;

        this.trees.forEach((tree,index) => {
            this.ctx.fillStyle = tree.color;
            this.ctx.fillRect(x, this.startY - (index * this.height), this.width,this.height);

            if(tree.value == 'left') {
                this.ctx.fillStyle = "#8e5a2c";
                this.roundRect(x-this.stemWidth, this.startY - (index * this.height) + this.height/2, this.stemWidth,this.stemHeight, 10);
            }
            if(tree.value == 'right') {
                this.ctx.fillStyle = "#8e5a2c";
                this.roundRect(x+this.width, this.startY - (index * this.height) + this.height/2, this.stemWidth,this.stemHeight, 10);
            }
        });

        this.ctx.fillStyle = this.stoneColor;
        this.roundRect(x-10, this.startY+this.height-10, 50, 30, 10);
        this.ctx.fillStyle = '#95a5a6';
        this.roundRect(x+20, this.startY+this.height-10, 80, 30, 10);
    }
}

// Fungsi randomNumber
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}
