/* ========================================
   ROHITH PORTFOLIO - ADVANCED APP.JS
   Creative Effects • Particles • Animations
======================================== */

// Global state
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// ============================================
// CURSOR
// ============================================

class Cursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursorFollower');
        this.pos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };

        this.init();
    }

    init() {
        if (!this.cursor || !this.follower) return;

        document.addEventListener('mousemove', (e) => {
            this.targetPos.x = e.clientX;
            this.targetPos.y = e.clientY;
        });

        // Add cursor:active on interactive elements
        document.querySelectorAll('a, button, .work-card, .skill-item').forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('active'));
        });

        this.animate();
    }

    animate() {
        this.pos.x += (this.targetPos.x - this.pos.x) * 0.2;
        this.pos.y += (this.targetPos.y - this.pos.y) * 0.2;

        this.cursor.style.left = this.pos.x - 10 + 'px';
        this.cursor.style.top = this.pos.y - 10 + 'px';

        followerX += (this.pos.x - followerX) * 0.1;
        followerY += (this.pos.y - followerY) * 0.1;

        this.follower.style.left = followerX - 4 + 'px';
        this.follower.style.top = followerY - 4 + 'px';

        requestAnimationFrame(() => this.animate());
    }
}


// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: 0, y: 0, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? '#6366f1' : '#0ea5e9',
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach((p, i) => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Mouse interaction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.mouse.radius) {
                const force = (this.mouse.radius - dist) / this.mouse.radius;
                p.x -= dx * force * 0.02;
                p.y -= dy * force * 0.02;
            }

            // Boundary check
            if (p.x < 0 || p.x > this.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.height) p.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

                if (d < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p.color;
                    this.ctx.globalAlpha = (1 - d / 120) * 0.2;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}


// ============================================
// MAGNETIC FIELD LINES
// ============================================

class FieldLines {
    constructor() {
        this.canvas = document.getElementById('fieldLines');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.nodes = [];

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();

        // Create magnetic nodes
        const nodeCount = Math.min(5, Math.floor(window.innerWidth / 300));
        this.nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: (window.innerWidth / (nodeCount + 1)) * (i + 1),
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                radius: 50 + Math.random() * 50,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.init());
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += 0.01;

        this.nodes.forEach((node, i) => {
            // Animate node position
            node.y += Math.sin(this.time + node.phase) * 0.3;

            // Draw field lines
            this.ctx.strokeStyle = '#6366f1';
            this.ctx.lineWidth = 0.5;
            this.ctx.globalAlpha = 0.1;

            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
                this.ctx.beginPath();

                let x = node.x;
                let y = node.y;

                for (let step = 0; step < 50; step++) {
                    const nextAngle = angle + Math.sin(this.time + step * 0.1) * 0.3;
                    x += Math.cos(nextAngle) * 15;
                    y += Math.sin(nextAngle) * 15;

                    this.ctx.lineTo(x, y);

                    if (x < 0 || x > this.width || y < 0 || y > this.height) break;
                }

                this.ctx.stroke();
            }
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}


// ============================================
// GSAP ANIMATIONS
// ============================================

class Animations {
    constructor() {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);
        this.init();
    }

    init() {
        this.setupLoader();
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupStatCounters();
        this.setupNavToggle();
    }

    setupLoader() {
        const loader = document.getElementById('loader');
        const progress = document.getElementById('loaderProgress');
        if (!loader) return;

        // Simulate loading
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 30;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);

                setTimeout(() => {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.6,
                        onComplete: () => {
                            loader.classList.add('hidden');
                            this.triggerHeroAnimations();
                        }
                    });
                }, 300);
            }
            if (progress) progress.style.width = width + '%';
        }, 100);
    }

    triggerHeroAnimations() {
        const tl = gsap.timeline();

        tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
          .from('.title-line:nth-child(1)', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.title-line:nth-child(2)', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.title-line:nth-child(3)', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.hero-cta', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    }

    setupScrollAnimations() {
        // Section labels
        gsap.utils.toArray('.section-label').forEach(label => {
            gsap.from(label, {
                scrollTrigger: {
                    trigger: label,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // About image
        gsap.from('.about-visual', {
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top 80%',
            },
            opacity: 0,
            x: -100,
            duration: 1,
            ease: 'power3.out'
        });

        // About stats
        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Work cards
        gsap.utils.toArray('.work-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 80,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Skills categories
        gsap.utils.toArray('.skill-category').forEach((cat, i) => {
            gsap.from(cat, {
                scrollTrigger: {
                    trigger: cat,
                    start: 'top 85%',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // Contact cards
        gsap.utils.toArray('.contact-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                },
                opacity: 0,
                x: 50,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Nav scroll effect
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            onUpdate: (self) => {
                const nav = document.getElementById('nav');
                if (self.direction === 1 && self.progress > 0) {
                    nav.classList.add('scrolled');
                } else if (self.progress === 0) {
                    nav.classList.remove('scrolled');
                }
            }
        });
    }

    setupSkillBars() {
        ScrollTrigger.create({
            trigger: '.skills-grid',
            start: 'top 70%',
            onEnter: () => {
                document.querySelectorAll('.skill-progress').forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    gsap.to(bar, {
                        width: width + '%',
                        duration: 1.2,
                        ease: 'power3.out'
                    });
                });
            },
            once: true
        });
    }

    setupStatCounters() {
        const counters = document.querySelectorAll('.stat-value[data-count]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            counter.innerHTML = Math.ceil(this.targets()[0].innerHTML) + '+';
                        }
                    });
                },
                once: true
            });
        });
    }

    setupNavToggle() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
}


// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});


// ============================================
// PARALLAX HOVER ON WORK CARDS
// ============================================

document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});


// ============================================
// MAGNETIC BUTTONS
// ============================================

document.querySelectorAll('.btn, .social-link, .contact-link').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});


// ============================================
// TILT ON ABOUT IMAGE
// ============================================

const aboutImage = document.querySelector('.image-frame');
if (aboutImage) {
    aboutImage.addEventListener('mousemove', (e) => {
        const rect = aboutImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        gsap.to(aboutImage, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    aboutImage.addEventListener('mouseleave', () => {
        gsap.to(aboutImage, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
    });
}


// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new Cursor();
    new ParticleSystem();
    new FieldLines();
    new Animations();

    console.log('🚀 Creative Portfolio Loaded!');
});
