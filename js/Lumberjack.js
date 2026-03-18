class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;

        this.background = '#d3f7ff';
        this.ctx = props.el.getContext('2d');

        this.cutSound = props.cutSound;
        this.tree = null;
        this.person = null;

        this.score = 0;

        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        this.highScore = localStorage.getItem('highScore') || 0;

        // ==============================
        // 🔥 TELEGRAM USER DETECTION (FINAL)
        // ==============================
        this.playerName = "Trainer 05";

        try {
            // 🧪 DEBUG
            console.log("WebApp:", window.Telegram?.WebApp?.initDataUnsafe);
            console.log("GameProxy:", window.TelegramGameProxy?.initParams);

            // =========================
            // ✅ 1. TELEGRAM GAME (PRIORITAS)
            // =========================
            if (window.TelegramGameProxy && TelegramGameProxy.initParams) {
                let params = TelegramGameProxy.initParams;

                if (params.user) {
                    let user = JSON.parse(params.user);

                    if (user.username) {
                        this.playerName = "@" + user.username;
                    } else if (user.first_name) {
                        this.playerName = user.first_name;
                    }
                }
            }

            // =========================
            // ✅ 2. TELEGRAM WEBAPP
            // =========================
            else if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
                let user = Telegram.WebApp.initDataUnsafe.user;

                if (user) {
                    if (user.username) {
                        this.playerName = "@" + user.username;
                    } else if (user.first_name) {
                        this.playerName = user.first_name;
                    }
                }
            }

        } catch (err) {
            console.log("User detection error:", err);
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

        // 🔥 PLAYER NAME
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Player: " + this.playerName, 30, 30);

        // SCORE
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Score", 30, 70);

        this.ctx.font = "32px Arial";
        this.ctx.fillText(this.score, 30, 110);

        // HIGHSCORE
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Highscore", 30, 160);

        this.ctx.font = "32px Arial";
        this.ctx.fillText(this.highScore, 30, 200);
    }

    draw() {
        this.drawBackground();
        this.tree.draw();
        this.person.draw();
        this.drawScore();
    }

    update() {}

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    move(direction) {
        this.person.characterPosition = direction;

        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // 🔊 SOUND
        let audio = new Audio();
        audio.src = "audio/cut.wav";
        audio.playbackRate = 2;
        audio.play();

        this.score++;

        let currentBranch = this.tree.trees[0].value;

        // 💀 COLLISION CHECK
        if (
            (currentBranch == 'left' && this.person.characterPosition == 'left') ||
            (currentBranch == 'right' && this.person.characterPosition == 'right')
        ) {
            setTimeout(() => {

                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }

                let highScore = localStorage.getItem('highScore') || 0;

                // 🔥 GAME OVER MESSAGE + USERNAME
                alert(
                    `You lose!\n\nPlayer: ${this.playerName}\nScore: ${this.score}\nHighscore: ${highScore}`
                );

                window.location.reload();

            }, 100);
        }
    }

    listener() {
        let that = this;

        window.addEventListener('keypress', (e) => {
            if (e.key == 'a' || e.key == 'ArrowLeft') {
                this.move('left');
            } else if (e.key == 'd' || e.key == 'ArrowRight') {
                this.move('right');
            }
        });

        this.btnLeft.addEventListener('click', () => {
            that.move('left');
        });

        this.btnRight.addEventListener('click', () => {
            that.move('right');
        });
    }
}
