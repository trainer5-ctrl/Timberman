class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.ctx = props.el.getContext('2d');
        
        this.background = '#d3f7ff'; // Warna langit biru muda
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        
        // Referensi Elemen UI HTML (Diambil dari index.html)
        this.elScore = document.getElementById('ui-current-score');
        this.elTimerBar = document.getElementById('timer-bar');
        
        // Callback fungsi dari main.js
        this.onGameOver = props.onGameOver;
        
        // Input Controls
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // --- DETEKSI USER TELEGRAM ---
        this.playerName = "Guest Player"; 
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            // Set warna header agar sinkron
            tg.setHeaderColor('#d3f7ff');
            if (tg.initDataUnsafe?.user) {
                const u = tg.initDataUnsafe.user;
                this.playerName = u.username ? "@" + u.username : u.first_name;
            }
        }
        
        // State Game Intern
        this.isGameOver = false;
        
        // Logika Timer/Waktu (Simulasi Bar)
        this.timerMax = 100; // 100%
        this.timerCurrent = this.timerMax;
        this.timerDecrement = 0.5; // Berapa cepat waktu habis per frame
    }

    // Inisialisasi awal (pohon & karakter)
    init() {
        this.person = new Person(this.canvas);
        // StartY disesuaikan agar pohon pas di atas tanah
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 300);
        this.tree.init();
        
        // Reset State
        this.isGameOver = false;
        this.score = 0;
        this.timerCurrent = this.timerMax;
        
        // Update UI HTML
        if(this.elScore) this.elScore.innerText = "0";
        if(this.elTimerBar) this.elTimerBar.style.width = "100%";
        
        this.listener();
    }
    
    // Fungsi untuk mereset game saat restart (tanpa reload halaman)
    reset() {
        this.tree.trees = []; // Kosongkan pohon lama
        this.init(); // Panggil init lagi
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
    
    // Fungsi Update (untuk logika waktu)
    update() {
        if (this.isGameOver) return;
        
        // Logika Waktu Habis (Simulasi Bar)
        this.timerCurrent -= this.timerDecrement;
        
        // Update UI Timer Bar
        if(this.elTimerBar) {
            const percentage = (this.timerCurrent / this.timerMax) * 100;
            this.elTimerBar.style.width = percentage + "%";
            
            // Ubah warna bar jadi merah jika waktu mau habis
            if (percentage < 30) {
                this.elTimerBar.style.background = "#e74c3c"; // Merah
            } else {
                this.elTimerBar.style.background = "#60c560"; // Hijau
            }
        }
        
        // Cek jika waktu habis
        if (this.timerCurrent <= 0) {
            this.triggerGameOver();
        }
    }

    render() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.render());
        }
    }

    move(direction) {
        if (this.isGameOver) return;
        
        this.person.characterPosition = direction;
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // Sound & Haptic Profesional
        const snd = new Audio("audio/cut.wav");
        snd.volume = 0.5;
        snd.play().catch(() => {});

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        
        // Tambah Skor
        this.score++;
        if(this.elScore) this.elScore.innerText = this.score;
        
        // Tambah sedikit waktu setiap kali memotong
        this.timerCurrent = Math.min(this.timerMax, this.timerCurrent + 5);

        let currentBranch = this.tree.trees[0].value;

        // --- CEK TABRAKAN ---
        if (currentBranch === direction) {
            this.triggerGameOver();
        }
    }
    
    // Fungsi Pusat untuk Game Over
    triggerGameOver() {
        if (this.isGameOver) return; // Mencegah pemicu ganda
        
        this.isGameOver = true;

        // Haptic Telegram saat kalah
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }

        // Atur Highscore
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.score);
        }

        // Panggil callback ke main.js untuk pindah screen
        if (this.onGameOver) {
            this.onGameOver(this.score, this.playerName, this.highScore);
        }
    }

    listener() {
        // Hapus listener lama dulu agar tidak menumpuk saat reset
        window.removeEventListener('keydown', this._keyDownHandler);
        
        // Definisikan handler agar bisa dihapus
        this._keyDownHandler = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.move('left');
            if (e.key === 'ArrowRight' || e.key === 'd') this.move('right');
        };
        
        // Support Keyboard (Desktop)
        window.addEventListener('keydown', this._keyDownHandler);

        // 🔥 OPTIMASI TOUCH (Mencegah Zoom/Scroll)
        const handleTouch = (e, direction) => {
            if (e.cancelable) e.preventDefault(); 
            this.move(direction);
        };

        // Hapus listener tombol lama
        this.btnLeft.onmousedown = null;
        this.btnRight.onmousedown = null;
        
        // Gunakan touchstart agar input terbaca seketika
        this.btnLeft.addEventListener('touchstart', (e) => handleTouch(e, 'left'), { passive: false });
        this.btnRight.addEventListener('touchstart', (e) => handleTouch(e, 'right'), { passive: false });
        
        // Fallback klik (Desktop)
        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }
}
