const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const columns = Math.floor(canvas.width / 100);
const teamos = [];
const hearts = [];

class Teamo {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = 1;
        this.exploding = false;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 61, 107, ${this.opacity})`;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText("TEAMO", this.x, this.y);
    }
    update() {
        if (!this.exploding) {
            this.y += this.speed;
        } else {
            this.size += 15;
            this.opacity -= 0.08;
        }
    }
    explode() {
        this.exploding = true;
    }
}

class Heart {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = 1;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 61, 107, ${this.opacity})`;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        ctx.bezierCurveTo(
            this.x, this.y,
            this.x - this.size / 2, this.y,
            this.x - this.size / 2, this.y + topCurveHeight
        );
        ctx.bezierCurveTo(
            this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x, this.y + (this.size + topCurveHeight) / 2,
            this.x, this.y + this.size
        );
        ctx.bezierCurveTo(
            this.x, this.y + (this.size + topCurveHeight) / 2,
            this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x + this.size / 2, this.y + topCurveHeight
        );
        ctx.bezierCurveTo(
            this.x + this.size / 2, this.y,
            this.x, this.y,
            this.x, this.y + topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
    }
    update() {
        this.y += this.speed;
        this.opacity -= 0.003;
    }
}

// Crear TEAMO en columnas
function createColumnTeamos() {
    for (let i = 0; i < columns; i++) {
        const x = i * 100 + 20;
        const y = -50 - Math.random() * 200;
        const size = 24;
        const speed = 3 + Math.random() * 2; // más rápido
        teamos.push(new Teamo(x, y, size, speed));
    }
}

// Crear corazones aleatorios
function createHeart() {
    const x = Math.random() * canvas.width;
    const y = -50;
    const size = 20 + Math.random() * 15;
    const speed = 1 + Math.random() * 2;
    hearts.push(new Heart(x, y, size, speed));
}

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TEAMO
    for (let i = teamos.length - 1; i >= 0; i--) {
        const t = teamos[i];
        t.update();
        t.draw();
        if (t.opacity <= 0 || t.y > canvas.height + 50) {
            teamos.splice(i, 1);
        }
    }

    // Corazones
    for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.update();
        h.draw();
        if (h.opacity <= 0 || h.y > canvas.height + 50) {
            hearts.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Lluvia constante más rápida
setInterval(createColumnTeamos, 1000);
setInterval(createHeart, 400);
animate();

// Overlay gigante fijo (no explota)
const overlay = document.getElementById('overlay');

// Explosión solo para la lluvia
canvas.addEventListener('click', (e) => {
    // Crear explosión de TEAMO en la posición del clic
    const t = new Teamo(e.clientX, e.clientY, 24 + Math.random() * 20, 3 + Math.random() * 2);
    t.explode();
    teamos.push(t);

    // Crear algunos corazones al hacer clic
    for (let i = 0; i < 5; i++) {
        createHeart();
    }
});

// Ajustar canvas al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
