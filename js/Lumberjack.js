class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.ctx = props.el.getContext('2d');
        
        this.background = '#d3f7ff';
        this.score = 0;

        // 🔥 HUBUNGKAN KE HTML
        this.scoreEl = document.getElementById("score");

        this.highScore = localStorage.getItem('highScore') || 0;
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // TELEGRAM USER
        this.playerName = "Guest Player"; 
        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.ready();
            tg.expand();

            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                const user = tg.initDataUnsafe.user;
                this.playerName = user.username 
                    ? "@" + user.username 
                    : `${user.first_name} ${user.last_name || ""}`.trim();
            }
        }

        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 350);
        this.drawBackground();
        this.tree.init();

        // 🔥 tampilkan score awal
        this.updateScoreUI();
    }

    drawBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let land = new Image();
        land.src = "images/land.png";
        this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
    }

    draw() {
        this.drawBackground();
        this.tree.draw();
        this.person.draw();
    }

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    // 🔥 UPDATE UI SCORE
    updateScoreUI() {
        if (this.scoreEl) {
            this.scoreEl.innerText = this.score;

            // efek animasi kecil
            this.scoreEl.style.transform = "scale(1.2)";
            setTimeout(() => {
                this.scoreEl.style.transform = "scale(1)";
            }, 100);
        }
    }

    move(direction) {
        this.person.characterPosition = direction;
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        let audio = new Audio("audio/cut.wav");
        audio.playbackRate = 2;
        audio.play().catch(() => {});

        // 🔥 TAMBAH SCORE
        this.score++;
        this.updateScoreUI();

        let currentBranch = this.tree.trees[0].value;

        if (currentBranch === direction) {
            if (window.Telegram.WebApp.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }

            setTimeout(() => {
                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }
                alert(`GAME OVER!\n\nPlayer: ${this.playerName}\nScore: ${this.score}`);
                window.location.reload();
            }, 50);
        }
    }

    listener() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
            if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
        });

        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }

    // Di dalam file Lumberjack.js

draw() {
    this.drawBackground();
    this.tree.draw();
    
    // TAMBAHKAN LINE INI:
    // Update frame animasi sebelum digambar
    if (this.person) {
        this.person.update(); 
    }
    
    this.person.draw();
}

render() {
    this.draw();
    requestAnimationFrame(() => this.render());
}
}
