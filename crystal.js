class Crystal {
    constructor() {
        this.reset();
        this.hue = Math.random() * 360;
        this.shape = Math.floor(Math.random() * 8); // 8 shapes
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    reset() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 20 + 10;
        this.velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        };
        this.acceleration = 0.05;
        this.maxSpeed = 1.5;
    }

    update(speedMultiplier, mouseX, mouseY, leftMouseDown, rightMouseDown, width, height) {
        const safeSpeed = Math.min(speedMultiplier, 1);
        
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (leftMouseDown) {
            const attractionStrength = Math.min(50 / distance, 0.5);
            this.velocity.x += (dx / distance) * attractionStrength * safeSpeed;
            this.velocity.y += (dy / distance) * attractionStrength * safeSpeed;
        }
        
        if (rightMouseDown) {
            const attractionStrength = Math.min(50 / distance, 0.5);
            const vortexStrength = 0.8;
            
            this.velocity.x += (dx / distance) * attractionStrength * safeSpeed * 0.5;
            this.velocity.y += (dy / distance) * attractionStrength * safeSpeed * 0.5;
            
            this.velocity.x += (-dy / distance) * vortexStrength * safeSpeed;
            this.velocity.y += (dx / distance) * vortexStrength * safeSpeed;
        }
        
        this.velocity.x += (Math.random() - 0.5) * this.acceleration * safeSpeed;
        this.velocity.y += (Math.random() - 0.5) * this.acceleration * safeSpeed;
        
        const speed = Math.sqrt(this.velocity.x**2 + this.velocity.y**2);
        if(speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }

        this.x += this.velocity.x * safeSpeed * 2;
        this.y += this.velocity.y * safeSpeed * 2;

        if(this.x < 0 || this.x > width) this.velocity.x *= -1;
        if(this.y < 0 || this.y > height) this.velocity.y *= -1;

        this.rotation += this.rotationSpeed * safeSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, 0.8)`;
        
        switch(this.shape) {
            case 0: // Hexagon
                ctx.beginPath();
                for(let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI)/3;
                    ctx.lineTo(
                        Math.cos(angle) * this.size/2,
                        Math.sin(angle) * this.size/2
                    );
                }
                ctx.closePath();
                break;
            case 1: // Star
                ctx.beginPath();
                for(let i = 0; i < 5; i++) {
                    let angle = (i * 0.4 * Math.PI) - Math.PI/2;
                    ctx.lineTo(
                        Math.cos(angle) * this.size/2,
                        Math.sin(angle) * this.size/2
                    );
                    angle += 0.2 * Math.PI;
                    ctx.lineTo(
                        Math.cos(angle) * this.size/4,
                        Math.sin(angle) * this.size/4
                    );
                }
                ctx.closePath();
                break;
            case 2: // Circle
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                break;
            case 3: // Square
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                break;
            case 4: // Triangle
                ctx.beginPath();
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(this.size/2, this.size/2);
                ctx.lineTo(-this.size/2, this.size/2);
                ctx.closePath();
                break;
            case 5: // Rhombus
                ctx.beginPath();
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(this.size/2, 0);
                ctx.lineTo(0, this.size/2);
                ctx.lineTo(-this.size/2, 0);
                ctx.closePath();
                break;
            case 6: // Cross
                ctx.beginPath();
                ctx.rect(-this.size/6, -this.size/2, this.size/3, this.size);
                ctx.rect(-this.size/2, -this.size/6, this.size, this.size/3);
                break;
            case 7: // Crescent
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0.5 * Math.PI, 1.5 * Math.PI);
                ctx.arc(0, this.size/4, this.size/4, 1.5 * Math.PI, 0.5 * Math.PI);
                break;
        }
        
        ctx.fill();
        ctx.restore();
    }
}

export default Crystal;