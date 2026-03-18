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

        // 🔥 DETEKSI USER TELEGRAM (FIXED)
        this.playerName = "Player 1";
        try {
            const webApp = window.Telegram?.WebApp;
            const gameProxy = window.TelegramGameProxy;

            if (webApp?.initDataUnsafe?.user) {
                const user = webApp.initDataUnsafe.user;
                this.playerName = user.username ? "@" + user.username : `${user.first_name} ${user.last_name || ""}`.trim();
            } else if (gameProxy?.initParams?.user) {
                const user = JSON.parse(gameProxy.initParams.user);
                this.playerName = user.username ? "@" + user.username : `${user.first_name} ${user.last_name || ""}`.trim();
            }
        } catch (err) {
            console.error("Detection error:", err);
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
        this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
    }

    drawScore() {
        this.ctx.fillStyle = "#333";
        this.ctx.font = "bold 18px Arial";
        this.ctx.fillText("Player: " + this.playerName, 30, 40);
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Score: " + this.score, 30, 80);
        this.ctx.fillText("High: " + this.highScore, 30, 115);
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

        let audio = new Audio("audio/cut.wav");
        audio.playbackRate = 2;
        audio.play().catch(() => {}); 

        this.score++;
        let currentBranch = this.tree.trees[0].value;

        // 💀 CEK TABRAKAN
        if ((currentBranch === direction)) {
            setTimeout(() => {
                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }
                alert(`GAME OVER!\nPlayer: ${this.playerName}\nScore: ${this.score}`);
                window.location.reload();
            }, 50);
        }
    }

    listener() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.move('left');
            if (e.key === 'ArrowRight' || e.key === 'd') this.move('right');
        });
        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }
}
