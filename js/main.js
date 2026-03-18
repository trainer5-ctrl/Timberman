const canvas = document.getElementById('canvas');
const person = new Person(canvas);

function gameLoop() {
    // 1. Bersihkan Kanvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update Animasi Karakter
    person.update();

    // 3. Gambar Karakter
    person.draw();

    // 4. Gambar objek lain (Tree, Lumberjack, dll)
    // tree.draw(); 

    requestAnimationFrame(gameLoop);
}

// Jalankan loop
gameLoop();

// Link-kan dengan tombol HTML Anda
document.getElementById('move-left').addEventListener('click', () => {
    person.moveLeft();
});

document.getElementById('move-right').addEventListener('click', () => {
    person.moveRight();
});
