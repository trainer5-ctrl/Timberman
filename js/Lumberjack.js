class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        // Penyesuaian ukuran canvas untuk layar smartphone
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 180; // Sisakan ruang untuk tombol
        this.ctx = props.el.getContext('2d');
        
        this.background = '#d3f7ff';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        
        // Element UI
        this.elName = document.getElementById('ui-name');
        this.elHigh = document.getElementById('ui-high');
        this.elScore = document.getElementById('ui-score');
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // Inisialisasi Telegram
        this.playerName = "Player 1";
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            if (tg.initDataUnsafe?.user) {
                const u = tg.initDataUnsafe.user;
                this.playerName = u.username ? "@" + u.username : u.first_name;
            }
        }

        // Update UI Awal
        this.elName.innerText = this.playerName;
        this.elHigh.innerText = this.highScore;

        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        // StartY disesuaikan agar pohon pas di atas tanah
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 300);
        this.tree.init();
    }

    drawBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        let land = new Image();
        land.src = "images/land.png";
        // Gambar tanah di bagian paling bawah canvas
        this.ctx.drawImage(land, 0, this.canvas.height - 250, this.canvas.width, 300);
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

    move(direction) {
        this.person.characterPosition = direction;
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // Sound & Haptic
        new Audio("audio/cut.wav").play().catch(() => {});
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }

        this.score++;
        this.elScore.innerText = this.score;

        let currentBranch = this.tree.trees[0].value;

        // Collision Check
        if (currentBranch === direction) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }

            if (this.score > this.highScore) {
                localStorage.setItem('highScore', this.score);
            }

            setTimeout(() => {
                alert(`GAME OVER!\nScore: ${this.score}`);
                window.location.reload();
            }, 100);
        }
    }

    listener() {
        // Support Keyboard (Desktop testing)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.move('left');
            if (e.key === 'ArrowRight' || e.key === 'd') this.move('right');
        });

        // Support Touch/Click (Smartphone)
        this.btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.move('left'); });
        this.btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.move('right'); });
        
        // Fallback untuk klik biasa
        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }
}
