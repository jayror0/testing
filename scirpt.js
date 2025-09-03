
        function loadStyles() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'style.css';
            document.head.appendChild(link);

            const dynamicStyles = document.createElement('style');
            dynamicStyles.textContent = `
                /* Dynamic styles injected via JavaScript */
                .dynamic-glow {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                .custom-cursor {
                    cursor: crosshair;
                }
            `;
            document.head.appendChild(dynamicStyles);
        }

        function createParticles() {
            const container = document.getElementById('particles-container');
            const particleCount = 15;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                

                const size = Math.random() * 20 + 10;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';


                particle.style.left = Math.random() * 100 + '%';
                

                particle.style.animationDelay = Math.random() * 20 + 's';
                

                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                container.appendChild(particle);
            }
        }

        function createShapes() {
            const container = document.getElementById('shapes-container');
            const shapes = ['triangle', 'circle', 'square'];
            const shapeCount = 6;

            for (let i = 0; i < shapeCount; i++) {
                const shapeWrapper = document.createElement('div');
                shapeWrapper.className = 'shape';
                
                const shape = document.createElement('div');
                shape.className = shapes[Math.floor(Math.random() * shapes.length)];
                

                shapeWrapper.style.left = Math.random() * 100 + '%';
                shapeWrapper.style.top = Math.random() * 100 + '%';
                

                shapeWrapper.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                shapeWrapper.appendChild(shape);
                container.appendChild(shapeWrapper);
            }
        }


        const themes = ['', 'theme-sunset', 'theme-ocean', 'theme-forest', 'theme-cosmic'];
        let currentTheme = 0;

        function changeTheme() {
            currentTheme = (currentTheme + 1) % themes.length;
            document.body.className = themes[currentTheme];
            

            createRipple(window.innerWidth / 2, window.innerHeight / 2);
        }


        function createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        }

        document.addEventListener('mousemove', (e) => {

            if (Math.random() > 0.98) {
                const trail = document.createElement('div');
                trail.style.position = 'absolute';
                trail.style.left = e.pageX + 'px';
                trail.style.top = e.pageY + 'px';
                trail.style.width = '5px';
                trail.style.height = '5px';
                trail.style.background = 'rgba(255, 255, 255, 0.5)';
                trail.style.borderRadius = '50%';
                trail.style.pointerEvents = 'none';
                trail.style.transition = 'all 1s ease-out';
                
                document.body.appendChild(trail);
                
                setTimeout(() => {
                    trail.style.transform = 'scale(3)';
                    trail.style.opacity = '0';
                }, 10);
                
                setTimeout(() => {
                    trail.remove();
                }, 1000);
            }
        });


        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                createRipple(e.pageX, e.pageY);
            }
        });


        function animateTitle() {
            const title = document.querySelector('.art-title');
            if (title) {

                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                title.style.textShadow = `0 0 30px ${randomColor}`;
                

                title.classList.add('dynamic-glow');
            }
        }


        window.addEventListener('DOMContentLoaded', () => {

            loadStyles();
            

            setTimeout(() => {
                createParticles();
                createShapes();
                animateTitle();
            }, 100);

            setInterval(() => {
                animateTitle();
            }, 3000);
            

            document.body.classList.add('custom-cursor');
            
        });


        window.addEventListener('resize', () => {

            const container = document.getElementById('particles-container');
            container.innerHTML = '';
            createParticles();
        });
