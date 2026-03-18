class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.ctx = props.el.getContext('2d');
        
        this.background = '#d3f7ff';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // ==============================
        // 🆔 PENGAMBILAN NAMA PLAYER
        // ==============================
        this.playerName = "Guest Player"; 

        // 1. Ambil dari URL Parameter (Metode Utama dari Bot)
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('playerName');

        if (nameFromUrl) {
            this.playerName = nameFromUrl;
        } 
        // 2. Backup: Ambil dari SDK WebApp (Jika dibuka sebagai Mini App)
        else if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            this.playerName = user.username ? "@" + user.username : user.first_name;
        }

        // Beritahu Telegram bahwa game siap
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }

        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 350);
        this.drawBackground();
        this.tree.init();
    }

    drawBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        let land = new Image();
        land.src = "images/land.png";
        // Tunggu gambar load atau gambar langsung jika sudah ada di cache
        this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
    }

    drawScore() {
        this.ctx.fillStyle = "#333";
        
        // Render Nama Player di Canvas
        this.ctx.font = "bold 18px Arial";
        let displayTitle = this.playerName.length > 15 ? this.playerName.substring(0, 12) + "..." : this.playerName;
        this.ctx.fillText("Player: " + displayTitle, 20, 40);

        // Render Score
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Score: " + this.score, 20, 75);
        this.ctx.fillText("High: " + this.highScore, 20, 105);
    }

    draw() {
        this.drawBackground();
        this.tree.draw();
        this.person.draw();
        this.drawScore();
    }

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    move(direction) {
        this.person.characterPosition = direction;
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // Sound Effect
        let audio = new Audio("audio/cut.wav");
        audio.playbackRate = 2;
        audio.play().catch(() => {});

        this.score++;
        let currentBranch = this.tree.trees[0].value;

        // Cek Tabrakan
        if (currentBranch === direction) {
            // Getar HP (Haptic Feedback)
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }

            setTimeout(() => {
                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }
                alert(`GAME OVER!\n\nPlayer: ${this.playerName}\nScore: ${this.score}\nHighscore: ${localStorage.getItem('highScore')}`);
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
}
