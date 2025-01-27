import Crystal from './crystal.js';

class Kaleidoscope {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.leftMouseDown = false;
        this.rightMouseDown = false;

        this.crystals = [];
        this.mirrorCount = 6;

        this.initEventListeners();
    }

    initEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        document.getElementById('mirrors').addEventListener('input', this.handleMirrorsChange.bind(this));
        document.getElementById('density').addEventListener('input', this.handleDensityChange.bind(this));
        document.getElementById('speed').addEventListener('input', this.handleSpeedChange.bind(this));
        document.getElementById('generate').addEventListener('click', this.init.bind(this));

        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleMouseDown(e) {
        if (e.button === 0) this.leftMouseDown = true;
        if (e.button === 2) this.rightMouseDown = true;
    }

    handleMouseUp(e) {
        if (e.button === 0) this.leftMouseDown = false;
        if (e.button === 2) this.rightMouseDown = false;
    }

    handleMouseLeave() {
        this.leftMouseDown = false;
        this.rightMouseDown = false;
    }

    handleMirrorsChange(e) {
        document.getElementById('mirrorsValue').textContent = e.target.value;
        this.mirrorCount = parseInt(e.target.value);
        this.init();
    }

    handleDensityChange(e) {
        document.getElementById('densityValue').textContent = e.target.value;
        this.init();
    }

    handleSpeedChange(e) {
        document.getElementById('speedValue').textContent = e.target.value;
    }

    handleResize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.init();
    }

    init() {
        const density = parseInt(document.getElementById('density').value);
        
        this.crystals = [];
        for(let i = 0; i < density; i++) {
            this.crystals.push(new Crystal());
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const speed = parseFloat(document.getElementById('speed').value);
        const segmentAngle = (Math.PI * 2) / this.mirrorCount;

        this.crystals.forEach(crystal => 
            crystal.update(speed, this.mouseX, this.mouseY, this.leftMouseDown, this.rightMouseDown, this.width, this.height)
        );

        for(let i = 0; i < this.mirrorCount; i++) {
            this.ctx.save();
            this.ctx.translate(this.width/2, this.height/2);
            this.ctx.rotate(segmentAngle * i);
            
            for(let j = 0; j < 2; j++) {
                this.ctx.scale(-1, 1);
                this.crystals.forEach(crystal => {
                    this.ctx.save();
                    this.ctx.translate(-this.width/2, -this.height/2);
                    crystal.draw(this.ctx);
                    this.ctx.restore();
                });
            }
            
            this.ctx.restore();
        }

        requestAnimationFrame(this.draw.bind(this));
    }

    start() {
        this.init();
        this.draw();
    }
}

// Initialize and start the Kaleidoscope
const kaleidoscope = new Kaleidoscope();
kaleidoscope.start();

export default Kaleidoscope;