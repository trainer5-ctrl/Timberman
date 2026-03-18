class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        // Buat canvas sedikit lebih tinggi untuk UI overlay
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight + 50; 
        this.ctx = props.el.getContext('2d');
        
        this.background = '#d3f7ff';
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // Referensi Elemen UI HTML (Overlay)
        this.uiScore = document.getElementById('ui-current-score');
        this.uiName = document.getElementById('ui-player-name');
        this.uiHigh = document.getElementById('ui-high-score');

        // ==========================================
        // 🆔 OTOMATIS AMBIL DATA USER TELEGRAM
        // ==========================================
        this.playerName = "Guest Player"; 

        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.ready();
            tg.expand(); // Fullscreen
            
            // Atur warna Header WebApp agar sinkron dengan game
            tg.setHeaderColor('#d3f7ff');

            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                const user = tg.initDataUnsafe.user;
                this.playerName = user.username ? "@" + user.username : `${user.first_name} ${user.last_name || ""}`.trim();
            }
        }

        // --- UPDATE UI MINI ---
        // Potong nama jika terlalu panjang
        let nameToDisplay = this.playerName.length > 18 ? this.playerName.substring(0, 15) + ".." : this.playerName;
        if(this.uiName) this.uiName.innerText = nameToDisplay;
        if(this.uiHigh) this.uiHigh.innerText = this.highScore;

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
        
        // Land/Tanah sedikit diturunkan agarUI di atas rapi
        let land = new Image();
        land.src = "images/land.png";
        this.ctx.drawImage(land, 0, this.canvas.height - 280, this.canvas.width, 350);
    }

    // 🔥 drawScore di canvas ini kita matikan total! 
    // UI kita handle lewat HTML/CSS agar profesional.
    drawScore() {}

    draw() {
        this.drawBackground();
        this.tree.draw();
        this.person.draw();
        // Kita tidak panggil drawScore canvas lagi
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

        // --- UPDATE SCORE & UI ---
        this.score++;
        if(this.uiScore) this.uiScore.innerText = this.score; // Update angka besar di tengah

        let currentBranch = this.tree.trees[0].value;

        if (currentBranch === direction) {
            // Haptic Telegram saat kalah
            if (window.Telegram.WebApp.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }

            // Atur Highscore
            if (this.score > this.highScore) {
                localStorage.setItem('highScore', this.score);
            }

            // Sedikit delay agar user sadar dia kalah
            setTimeout(() => {
                alert(`GAME OVER!\n\nPlayer: ${this.playerName}\nScore: ${this.score}`);
                window.location.reload();
            }, 80);
        }
    }

    listener() {
        // Atur agar tombol responsif saat ditekan
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
            if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
        });
        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }
}
