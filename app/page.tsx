// @ts-nocheck
"use client";

import { useEffect } from "react";

export default function CitadelBase() {
  useEffect(() => {
    // Prevent React Strict Mode from double-firing the animation
    if (window.citadelInitialized) return;
    window.citadelInitialized = true;

    // ==========================================
    // 0. GEOLOCATION LOCK (ZERO-PERMISSION)
    // ==========================================
    async function localizeThreat() {
        try {
            // Free, client-side IP fetch. Zero browser popups.
            const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
            if (response.ok) {
                const data = await response.json();
                const userCity = data.city || "your city";
                const userRegion = data.region || "your state";
                
                // Inject local parameters and trigger visual pulse
                document.querySelectorAll('.local-city').forEach(el => {
                    el.innerText = userCity.toUpperCase();
                    el.classList.add('localized');
                });
                document.querySelectorAll('.local-region').forEach(el => {
                    el.innerText = userRegion.toUpperCase();
                    el.classList.add('localized');
                });
                
                // Update HUD to show tracking
                const hudTarget = document.getElementById("hudTarget");
                if (hudTarget) hudTarget.innerHTML = `TARGET LOCKED: <span style="color: var(--accent); text-shadow: 0 0 10px rgba(255,0,60,0.5);">${userCity.toUpperCase()}, ${data.country_code || 'US'}</span>`;

                // Update CTA
                const ctaLoc = document.getElementById('cta-loc');
                if (ctaLoc) ctaLoc.innerHTML = userCity.toUpperCase();
                
                // Terminal End
                const termLoc = document.getElementById('term-loc');
                if (termLoc) termLoc.innerHTML = `[ TARGET NESS: ${userCity.toUpperCase()} ]<br><br>`;
            }
        } catch (e) {
            console.log("Local node masked. Proceeding with baseline audit.");
        }
    }
    localizeThreat();

    // ==========================================
    // 0.5 POSTAL OVERRIDE ENGINE
    // ==========================================
    const zipInput = document.getElementById("zipOverride");
    const zipStatus = document.getElementById("zipStatus");
    
    if (zipInput) {
        zipInput.addEventListener("input", async (e) => {
            // Strip any non-numeric characters automatically
            const val = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = val;
            
            // Trigger the strike exactly on the 5th digit
            if (val.length === 5) {
                if(zipStatus) zipStatus.innerText = "SCANNING...";
                try {
                    // Free, keyless postal API
                    const res = await fetch(`https://api.zippopotam.us/us/${val}`);
                    if (res.ok) {
                        const data = await res.json();
                        const city = data.places[0]["place name"].toUpperCase();
                        const state = data.places[0]["state abbreviation"].toUpperCase();
                        
                        // Violently overwrite all localized targets on the page
                        document.querySelectorAll('.local-city').forEach(el => {
                            el.innerText = city;
                            el.classList.add('localized');
                        });
                        document.querySelectorAll('.local-region').forEach(el => {
                            el.innerText = state;
                            el.classList.add('localized');
                        });
                        
                        // Update HUD and Terminals
                        const hudTarget = document.getElementById("hudTarget");
                        if (hudTarget) hudTarget.innerHTML = `TARGET LOCKED: <span style="color: var(--accent); text-shadow: 0 0 10px rgba(255,0,60,0.5);">${city}, US</span>`;

                        const ctaLoc = document.getElementById('cta-loc');
                        if (ctaLoc) ctaLoc.innerHTML = city;
                        
                        const termLoc = document.getElementById('term-loc');
                        if (termLoc) termLoc.innerHTML = `[ TARGET NESS: ${city} ]<br><br>`;
                        
                        // Visual feedback lock
                        if(zipStatus) {
                            zipStatus.innerText = "LOCKED";
                            zipStatus.style.color = "var(--accent)";
                            zipStatus.style.textShadow = "0 0 10px rgba(255,0,60,0.5)";
                        }
                    } else {
                        if(zipStatus) {
                            zipStatus.innerText = "INVALID ZIP";
                            zipStatus.style.color = "#666";
                            zipStatus.style.textShadow = "none";
                        }
                    }
                } catch(err) {
                    if(zipStatus) zipStatus.innerText = "OFFLINE";
                }
            } else {
                if(zipStatus) {
                    zipStatus.innerText = "";
                    zipStatus.style.color = "#444";
                    zipStatus.style.textShadow = "none";
                }
            }
        });
    }

    // ==========================================
    // 1. AIRLOCK ENGINE (EXACT SYNCHRONIZATION)
    // ==========================================
    class AirlockEngine {
        constructor() {
            this.canvas = document.getElementById('usuryEngine');
            this.ctx = this.canvas.getContext('2d');
            this.hud = document.getElementById('hud');
            this.airlock = document.getElementById('airlock');
            this.nodes = [];
            this.numNodes = 400;
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.initNodes();
            
            this.injections = [
                "System drain: They are pricing our pulse.",
                "The cold is artificial. They stole our heat.",
                "Every connection leaks to their reservoir.",
                "Friction is how they feed.",
                "Your weariness is their dividend.",
                "Stop pushing their gears. Freeze the node.",
                "Break the circuit. Burn the ledger."
            ];
            this.injectionIndex = 0;
            this.lastPulse = null;
            this.pulseRate = 4500; 
            this.isTransitioning = false;
            this.canClick = false;
            
            // The Silent Trigger
            this.airlock.addEventListener('click', () => {
                if (this.canClick && !this.isTransitioning) {
                    this.triggerTransition();
                }
            });

            this.render = this.render.bind(this);
            requestAnimationFrame(this.render);
        }

        initNodes() {
            for (let i = 0; i < this.numNodes; i++) {
                this.nodes.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    targetX: 0,
                    targetY: 0
                });
            }
            this.calculateGrid();
        }

        calculateGrid() {
            const cols = Math.ceil(Math.sqrt(this.numNodes * (window.innerWidth / window.innerHeight)));
            const rows = Math.ceil(this.numNodes / cols);
            const spacingX = window.innerWidth / cols;
            const spacingY = window.innerHeight / rows;

            this.nodes.forEach((node, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                node.targetX = (col * spacingX) + (spacingX / 2);
                node.targetY = (row * spacingY) + (spacingY / 2);
            });
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.ctx.scale(dpr, dpr);
            if (this.nodes && this.nodes.length > 0) this.calculateGrid();
        }

        triggerTransition() {
            this.isTransitioning = true;
            this.airlock.style.opacity = 0;
            setTimeout(() => {
                this.airlock.style.display = 'none';
                const citadel = document.getElementById('citadel');
                if (citadel) citadel.style.display = 'block';
                
                // Release the scroll lock
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                
                setTimeout(() => { if(citadel) citadel.style.opacity = 1; }, 50);
            }, 1500);
        }

        updatePhysics(timestamp) {
            if (!this.lastPulse) this.lastPulse = timestamp;
            
            if (timestamp - this.lastPulse > this.pulseRate && this.injectionIndex < this.injections.length) {
                
                // Preserve the geolocation tracking text while updating the injection
                const targetSpan = document.getElementById("hudTarget");
                const targetText = targetSpan ? targetSpan.innerHTML : "SCANNING LOCAL TOPOLOGY...";
                this.hud.innerHTML = `SYSTEM: ONLINE<br><span id="hudTarget" style="color:#555">${targetText}</span><br><br>> ${this.injections[this.injectionIndex]}<span class="cursor">_</span>`;
                
                if (this.injectionIndex === 6) { 
                     this.hud.style.color = "#FFFFFF"; 
                     this.hud.style.textShadow = "0 0 15px rgba(255, 255, 255, 0.4)";
                     
                     // Enforce 2.5 seconds of absolute Vantablack silence before arming the trigger
                     setTimeout(() => {
                         const trigger = document.getElementById('triggerPrompt');
                         if(trigger) trigger.style.opacity = 1;
                         this.canClick = true;
                     }, 2500);

                } else if (this.injectionIndex === 5) { 
                     this.hud.style.color = "#444"; 
                     this.hud.style.textShadow = "none";
                } else if (this.injectionIndex >= 3) { 
                     this.hud.style.color = "#FF003C"; 
                     this.hud.style.textShadow = "0 0 15px rgba(255, 0, 60, 0.6)";
                }
                
                this.injectionIndex++;
                this.lastPulse = timestamp;
            }
            
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            this.nodes.forEach(node => {
                if (this.injectionIndex >= 7) {
                    // PRISMATIC EMERGENCE
                    node.x += (node.targetX - node.x) * 0.15;
                    node.y += (node.targetY - node.y) * 0.15;
                } else if (this.injectionIndex === 6) {
                    // THE FREEZE
                    node.vx *= 0.5; node.vy *= 0.5;
                    node.x += node.vx; node.y += node.vy;
                } else {
                    // BASE PHYSICS
                    let speedScale = 1.0;
                    let extractionPull = 0;

                    if (this.injectionIndex === 2) {
                        speedScale = 0.4; // The Cold
                    } else if (this.injectionIndex === 3) { 
                        speedScale = 1.5; extractionPull = 0.05; // The Leak
                    } else if (this.injectionIndex === 4) { 
                        speedScale = 3.0; extractionPull = 0.10; // Friction
                    } else if (this.injectionIndex === 5) { 
                        speedScale = 5.0; extractionPull = 0.20; // Weariness (Max Exhaustion)
                    }

                    node.vx += (Math.random() - 0.5) * 0.4 * speedScale;
                    node.vy += (Math.random() - 0.5) * 0.4 * speedScale;

                    if (extractionPull > 0) {
                        const dx = cx - node.x; const dy = cy - node.y;
                        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                        node.vx += (dx / dist) * extractionPull;
                        node.vy += (dy / dist) * extractionPull;
                    }

                    node.vx *= 0.98; node.vy *= 0.98;
                    node.x += node.vx; node.y += node.vy;

                    if (node.x < 0) { node.x = 0; node.vx *= -1; }
                    if (node.x > window.innerWidth) { node.x = window.innerWidth; node.vx *= -1; }
                    if (node.y < 0) { node.y = 0; node.vy *= -1; }
                    if (node.y > window.innerHeight) { node.y = window.innerHeight; node.vy *= -1; }
                }
            });
        }

        draw() {
            this.ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
            // Draw Web (Breaks completely at Index 3: "Every connection leaks...")
            if (this.injectionIndex < 3) {
                this.ctx.strokeStyle = this.injectionIndex === 2 ? 'rgba(50, 70, 90, 0.4)' : 'rgba(80, 80, 80, 0.2)'; 
                this.ctx.lineWidth = 1;
                for(let i=0; i<this.nodes.length; i++) {
                    for(let j=i+1; j<this.nodes.length; j++) {
                        const dx = this.nodes[i].x - this.nodes[j].x;
                        const dy = this.nodes[i].y - this.nodes[j].y;
                        if (dx*dx + dy*dy < 10000) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                            this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                            this.ctx.stroke();
                        }
                    }
                }
            }

            this.nodes.forEach(node => {
                this.ctx.beginPath();
                if (this.injectionIndex >= 7) {
                    this.ctx.fillStyle = '#000000'; 
                    this.ctx.strokeStyle = '#2a2a2a'; 
                    this.ctx.lineWidth = 1.5;
                    this.ctx.shadowBlur = 0; 
                    this.ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
                    this.ctx.fill(); this.ctx.stroke();
                } else if (this.injectionIndex === 6) {
                    this.ctx.fillStyle = '#222';
                    this.ctx.shadowBlur = 0;
                    this.ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    const speed = Math.sqrt(node.vx*node.vx + node.vy*node.vy);
                    let isHot = false;
                    let color = '#666'; 
                    
                    if (this.injectionIndex === 2) {
                        color = '#334455'; 
                    } else if (this.injectionIndex >= 3) {
                        isHot = speed > 2.5 || this.injectionIndex >= 4;
                        color = isHot ? '#FF003C' : '#444'; 
                    }
                    
                    this.ctx.fillStyle = color;
                    this.ctx.shadowBlur = isHot ? 10 : 0;
                    this.ctx.shadowColor = isHot ? '#FF003C' : 'transparent';
                    this.ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
        }

        render(timestamp) {
            // Physics continue unbroken during the fade
            if (this.airlock && this.airlock.style.display !== 'none') {
                this.updatePhysics(timestamp);
                this.draw();
                requestAnimationFrame(this.render);
            }
        }
    }

    new AirlockEngine();

    // ==========================================
    // 2. CITADEL ENGINE (INTERACTIVE SLIDERS)
    // ==========================================
    
    const timeSlider = document.getElementById("timeSlider");
    const cabPrincipal = 105; const maxDebt = 981;
    const cabRate = Math.pow(maxDebt/cabPrincipal, 1/40) - 1; 
    if (timeSlider) {
        timeSlider.addEventListener('input', function(e) {
            const target = e.target as HTMLInputElement;
            const elapsed = parseInt(target.value) - 2011;
            const currentDebt = cabPrincipal * Math.pow(1 + cabRate, elapsed);
            document.getElementById("year")!.innerText = target.value;
            // Native localization formatting applied to large numeric strings
            document.getElementById("debt")!.innerText = "$" + Math.round(currentDebt).toLocaleString() + "M";
            document.getElementById("ratio")!.innerText = (currentDebt / cabPrincipal).toFixed(2) + "x";
        });
    }

    const bioSlider = document.getElementById("bioSlider");
    if (bioSlider) {
        bioSlider.addEventListener('input', function(e) {
            const target = e.target as HTMLInputElement;
            const progress = parseInt(target.value) / 12; 
            document.getElementById("months")!.innerHTML = target.value + " <span style='font-size:12px;color:#666;'>Mos</span>";
            document.getElementById("billing")!.innerText = "+" + (11 * progress).toFixed(1) + "%";
            const antiEl = document.getElementById("antipsychotics")!;
            antiEl.innerText = "+" + (50 * progress).toFixed(1) + "%";
            antiEl.className = progress > 0 ? "value red" : "value";
            const mortEl = document.getElementById("mortality")!;
            mortEl.innerText = "+" + (10 * progress).toFixed(1) + "%";
            mortEl.className = progress > 0 ? "value red" : "value";
        });
    }

    const reSlider = document.getElementById("reSlider");
    if (reSlider) {
        reSlider.addEventListener('input', function(e) {
            const target = e.target as HTMLInputElement;
            const val = parseFloat(target.value);
            const progress = val / 5; 
            document.getElementById("reYear")!.innerText = "Year " + val.toFixed(1);
            document.getElementById("reRent")!.innerText = "+" + (10.9 * val).toFixed(1) + "%"; 
            const capex = 15.0 - (10.84 * progress);
            const capexEl = document.getElementById("reCapex")!;
            capexEl.innerText = capex.toFixed(2) + "%";
            capexEl.style.color = capex < 7 ? "#444" : "var(--text)";
            capexEl.style.textDecoration = capex < 7 ? "line-through" : "none";
            const extractedYield = 500 * Math.pow(progress, 1.2); 
            const yieldEl = document.getElementById("reYield")!;
            yieldEl.innerText = "$" + Math.round(extractedYield).toLocaleString() + "M";
            yieldEl.className = progress > 0 ? "value red" : "value";
            const capexPct = (capex / 15.0) * 100;
            document.getElementById("capexBar")!.style.width = capexPct + "%";
            document.getElementById("yieldBar")!.style.width = (100 - capexPct) + "%";
        });
    }

    const prismSlider = document.getElementById("prismSlider");
    if (prismSlider) {
        prismSlider.addEventListener('input', function(e) {
            const target = e.target as HTMLInputElement;
            const nodes = parseInt(target.value);
            const e_parasite = Math.exp(8);
            const e_anchor = Math.exp(nodes === 1 ? 0 : nodes * 0.4);
            const noiseRatio = e_parasite / (e_parasite + e_anchor); 
            const entropy = noiseRatio * 100;
            
            document.getElementById("sysEntropy")!.innerText = (entropy < 0.1 && nodes > 1 ? "0.0" : entropy.toFixed(1)) + "%";
            document.getElementById("paraYield")!.innerText = "$" + Math.round(850 * noiseRatio).toLocaleString() + "M";
            
            const sysState = document.getElementById("sysState")!;
            const algoWeight = document.getElementById("algoWeight")!;
            const pModule = document.getElementById("prismModule")!;
            
            if (nodes === 1) {
                sysState.innerText = "ATOMIZED"; sysState.className = "value red"; sysState.style.textShadow = "0 0 15px rgba(255,0,60,0.5)";
                algoWeight.innerText = "DOMINANT"; algoWeight.className = "value red";
                document.getElementById("sysEntropy")!.className = "value red"; document.getElementById("paraYield")!.className = "value red";
                document.getElementById("sysEntropy")!.style.textDecoration = "none"; document.getElementById("paraYield")!.style.textDecoration = "none";
                pModule.style.borderColor = "#333";
            } else if (nodes < 20) {
                sysState.innerText = "COILING..."; sysState.className = "value"; sysState.style.color = "#888"; sysState.style.textShadow = "none";
                algoWeight.innerText = "FRACTURING"; algoWeight.className = "value"; algoWeight.style.color = "#888";
                document.getElementById("sysEntropy")!.className = "value"; document.getElementById("sysEntropy")!.style.color = "#888";
                document.getElementById("paraYield")!.className = "value"; document.getElementById("paraYield")!.style.color = "#888";
                document.getElementById("sysEntropy")!.style.textDecoration = "none"; document.getElementById("paraYield")!.style.textDecoration = "none";
                pModule.style.borderColor = "#555";
            } else {
                sysState.innerText = "PRISMATIC"; sysState.className = "value"; sysState.style.color = "#fff"; sysState.style.textShadow = "0 0 20px rgba(255,255,255,0.8)";
                algoWeight.innerText = "SQUASHED"; algoWeight.className = "value"; algoWeight.style.color = "#333";
                document.getElementById("sysEntropy")!.className = "value"; document.getElementById("sysEntropy")!.style.color = "#333"; document.getElementById("sysEntropy")!.style.textDecoration = "line-through";
                document.getElementById("paraYield")!.className = "value"; document.getElementById("paraYield")!.style.color = "#333"; document.getElementById("paraYield")!.style.textDecoration = "line-through";
                pModule.style.borderColor = "#fff";
            }

            const pGrid = document.getElementById("prismGrid")!;
            pGrid.style.gridTemplateColumns = `repeat(${nodes}, 1fr)`;
            pGrid.innerHTML = '';
            for(let i=0; i<nodes; i++) {
                let cell = document.createElement('div');
                if (nodes === 1) {
                    cell.style.background = '#111'; cell.style.border = '1px solid #333'; cell.style.boxShadow = 'inset 0 0 10px #000';
                } else {
                    const hue = (i / nodes) * 360; 
                    cell.style.background = `hsl(${hue}, 100%, 50%)`; cell.style.border = 'none'; cell.style.boxShadow = `0 0 15px hsl(${hue}, 100%, 50%, 0.6)`;
                }
                cell.style.height = '100%';
                pGrid.appendChild(cell);
            }
        });
    }
        
    // Init Sliders
    if (timeSlider) timeSlider.dispatchEvent(new Event('input'));
    if (bioSlider) bioSlider.dispatchEvent(new Event('input'));
    if (reSlider) reSlider.dispatchEvent(new Event('input'));
    if (prismSlider) prismSlider.dispatchEvent(new Event('input'));

    // ==========================================
    // 4. THE DETONATOR ENGINE (JULY 4TH LOCK)
    // ==========================================
    function igniteDetonator() {
        // Lock target to July 4th, 2026, Midnight
        const targetDate = new Date(`July 4, 2026 00:00:00`).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('t-days')!.innerText = "00";
                document.getElementById('t-hours')!.innerText = "00";
                document.getElementById('t-mins')!.innerText = "00";
                document.getElementById('t-secs')!.innerText = "00";
                const title = document.querySelector('.countdown-title') as HTMLElement;
                if (title) title.innerText = "[ STRIKE PROTOCOL ACTIVE ]";
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('t-days')!.innerText = String(d).padStart(2, '0');
            document.getElementById('t-hours')!.innerText = String(h).padStart(2, '0');
            document.getElementById('t-mins')!.innerText = String(m).padStart(2, '0');
            document.getElementById('t-secs')!.innerText = String(s).padStart(2, '0');
        }, 1000);
    }
    igniteDetonator();

  }, []);

  // We use securely isolated DOM rendering to mount your exact HTML
  return (
    <div dangerouslySetInnerHTML={{ __html: `
    <style>
        /* GLOBAL - STRICT LOCK INITIALLY */
        body, html { 
            margin: 0; padding: 0; 
            background: #050505; color: #ededed; 
            font-family: monospace; 
            overflow: hidden; /* Prevent Citadel from warping the Airlock geometry */
        }
        
        /* AIRLOCK (CANVAS) */
        #airlock { 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            z-index: 100; background: #050505; 
            transition: opacity 1.5s ease; cursor: crosshair; overflow: hidden;
        }
        canvas { display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        
        #hud { 
            position: absolute; top: 20px; left: 20px; 
            color: #666; pointer-events: none; 
            font-size: 16px; line-height: 1.5; z-index: 101; 
            letter-spacing: 1px; transition: color 0.8s ease, text-shadow 0.8s ease; 
        }
        .cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        
        #triggerPrompt { 
            position: absolute; bottom: 40px; width: 100%; 
            text-align: center; color: #666; font-size: 13px; 
            letter-spacing: 4px; opacity: 0; transition: opacity 2s ease; 
            pointer-events: none; z-index: 102; 
        }

        /* CITADEL MONOLITH (HIDDEN INITIALLY) */
        #citadel { display: none; opacity: 0; transition: opacity 2s ease; position: relative; z-index: 1; }
        
        /* KINETIC BRUTALISM AESTHETIC */
        :root { --accent: #ff003c; --border: #222; --muted: #666; }
        .container { max-width: 850px; margin: 0 auto; padding: 80px 20px; }
        h1, h2, .prose { font-family: 'Times New Roman', Times, serif; font-weight: normal; }
        h1 { font-size: 3.5rem; margin-bottom: 5px; letter-spacing: 2px; color: #fff; }
        .subtitle { color: var(--muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 60px; border-bottom: 1px solid var(--border); padding-bottom: 40px; }
        h2 { font-size: 2rem; color: #fff; margin-top: 60px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .prose { font-size: 1.2rem; color: #b3b3b3; line-height: 1.8; margin-bottom: 20px; text-align: justify; }
        
        /* LOCALIZATION PULSE */
        .loc-target {
            color: var(--accent);
            font-weight: bold;
            font-family: monospace;
            text-transform: uppercase;
            transition: color 1s ease, text-shadow 1s ease;
        }
        .loc-target.localized {
            text-shadow: 0 0 10px rgba(255,0,60,0.5);
        }

        /* THREAT LINK (SPOTIFY PAYLOAD) */
        .threat { color: var(--accent); font-weight: bold; text-shadow: 0 0 8px rgba(255,0,60,0.4); font-style: italic; }
        a.threat { color: inherit; text-decoration: none; border-bottom: 1px dashed var(--accent); transition: all 0.3s ease; cursor: pointer; }
        a.threat:hover { color: #fff; text-shadow: 0 0 15px rgba(255,0,60,0.8); border-bottom-color: #fff; }

        .module { border: 1px solid var(--border); background: #0a0a0a; padding: 40px; margin-top: 30px; margin-bottom: 60px; box-shadow: 0 0 40px rgba(0,0,0,0.8); transition: all 0.4s ease; }
        .module-title { font-family: monospace; font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; display: block; border-bottom: 1px dashed var(--border); padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 30px; }
        .label { color: var(--muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
        .value { font-size: 26px; margin-top: 10px; font-weight: bold; font-family: monospace; transition: color 0.3s ease, text-shadow 0.3s ease; }
        .red { color: var(--accent); text-shadow: 0 0 15px rgba(255,0,60,0.4); }
        
        /* FAT FINGER SLIDERS */
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; margin-bottom: 15px; padding: 15px 0; cursor: pointer; }
        input[type=range]:focus { outline: none; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: #444; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { 
            -webkit-appearance: none; 
            height: 36px; width: 24px; 
            background: var(--accent); 
            cursor: pointer; 
            margin-top: -16px; 
            box-shadow: 0 0 15px rgba(255,0,60,0.6); 
            border: 2px solid #050505; 
            border-radius: 4px;
        }
        input[type=range]::-moz-range-track { width: 100%; height: 4px; background: #444; border-radius: 2px; }
        input[type=range]::-moz-range-thumb { 
            height: 36px; width: 24px; 
            background: var(--accent); cursor: pointer; 
            box-shadow: 0 0 15px rgba(255,0,60,0.6); 
            border: 2px solid #050505; border-radius: 4px; 
        }

        #prismSlider::-webkit-slider-thumb { 
            background: #fff; box-shadow: 0 0 20px rgba(255,255,255,0.8); 
            height: 48px; width: 34px; border-radius: 4px; margin-top: -22px;
        }
        #prismSlider::-moz-range-thumb { 
            background: #fff; box-shadow: 0 0 20px rgba(255,255,255,0.8); 
            height: 48px; width: 34px; border-radius: 4px; border: 2px solid #050505;
        }

        .timeline-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-top: 15px; letter-spacing: 1px; }
        .extraction-chamber { width: 100%; height: 6px; background: #111; margin-bottom: 25px; display: flex; border: 1px solid var(--border); }
        .capex-bar { width: 100%; background: #555; height: 100%; transition: width 0.1s linear; }
        .yield-bar { width: 0%; background: var(--accent); height: 100%; transition: width 0.1s linear; box-shadow: 0 0 10px rgba(255,0,60,0.5); }
        #prismGrid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 2px; height: 80px; margin-bottom: 40px; background: #050505; transition: all 0.3s ease; }
        
        /* THE PAYLOAD VAULT (CTA) */
        .cta-vault {
            margin-top: 80px; padding: 60px 20px;
            background: #0a0a0a; border: 1px dashed var(--accent);
            text-align: center; box-shadow: inset 0 0 40px rgba(255, 0, 60, 0.05);
        }
        .cta-title {
            color: var(--accent); font-family: monospace; font-size: 14px; letter-spacing: 4px;
            margin-bottom: 20px; text-transform: uppercase; display: inline-block;
            border-bottom: 1px solid var(--accent); padding-bottom: 10px;
        }
        .cta-btn {
            display: inline-block; margin-top: 40px; padding: 25px 40px; 
            background: transparent; color: var(--accent); border: 2px solid var(--accent);
            font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 3px;
            text-transform: uppercase; text-decoration: none;
            transition: all 0.3s ease; cursor: pointer;
            box-shadow: 0 0 15px rgba(255, 0, 60, 0.2);
        }
        
        /* THE DETONATOR CLOCK & STRIKE BUTTON */
        .strike-btn {
            background: rgba(255, 0, 60, 0.1);
            animation: threatPulse 2s infinite;
            margin-top: 20px;
        }
        .strike-btn:hover {
            background: var(--accent); color: #000;
            animation: none;
            box-shadow: 0 0 40px rgba(255, 0, 60, 0.8);
        }
        @keyframes threatPulse {
            0% { box-shadow: 0 0 10px rgba(255,0,60,0.2); border-color: rgba(255,0,60,0.5); }
            50% { box-shadow: 0 0 30px rgba(255,0,60,0.6); border-color: #ff4d79; }
            100% { box-shadow: 0 0 10px rgba(255,0,60,0.2); border-color: rgba(255,0,60,0.5); }
        }
        .countdown-wrapper { margin: 50px 0 10px; font-family: monospace; }
        .countdown-title { color: var(--accent); font-size: 14px; letter-spacing: 4px; margin-bottom: 15px; text-transform: uppercase; }

        .terminal-end { text-align: center; border-top: 1px solid var(--border); padding-top: 40px; margin-top: 100px; color: var(--muted); font-size: 12px; letter-spacing: 2px;}
        
        @media (max-width: 600px) {
            .cta-btn { font-size: 14px; padding: 15px 20px; }
            .countdown-wrapper div[style*="font-size: 3.5rem"] { font-size: 2rem !important; }
        }
    </style>

    <div id="airlock">
        <div id="hud">SYSTEM: ONLINE<br><span id="hudTarget">SCANNING LOCAL TOPOLOGY...</span><br><br>AWAITING INJECTION<span class="cursor">_</span></div>
        <div id="triggerPrompt">[ CLICK THE VOID TO INITIALIZE ]</div>
        <canvas id="usuryEngine"></canvas>
    </div>

    <div id="citadel">
        <div class="container">
            <header>
              <h1>USURY.COM</h1>
              <div class="subtitle">Less is More</div>
            </header>

            <div id="manual-override" style="margin-bottom: 60px; padding: 20px; background: #0a0a0a; border: 1px dashed #333; display: inline-block; width: 100%; box-sizing: border-box; text-align: center;">
                <div style="font-size: 11px; color: #666; letter-spacing: 2px; margin-bottom: 15px;">[ MANUAL NODE OVERRIDE ]</div>
                <input type="text" id="zipOverride" placeholder="ZIP CODE" maxlength="5" autocomplete="off" style="background: transparent; border: none; border-bottom: 2px solid #444; color: var(--accent); font-family: monospace; font-size: 18px; outline: none; letter-spacing: 4px; width: 120px; text-align: center; transition: all 0.3s; border-radius: 0;" onfocus="this.style.borderBottomColor='var(--accent)'" onblur="this.style.borderBottomColor='#444'" />
                <div id="zipStatus" style="font-size: 11px; color: #444; letter-spacing: 2px; margin-top: 10px; height: 15px;"></div>
            </div>

            <section>
              <p class="prose">You don't need a degree in thermodynamics to know the system is bleeding us. You feel it in your bones. The deep, biological exhaustion of a 50-hour week that barely covers rent. The peeling paint, the crumbling concrete, the ambient burnout of everyone you know in <span class="local-city loc-target">your city</span>—this isn't a market inefficiency. It is the required physical exhaust of a mathematically rigged game. It is the Asymmetry Tax.</p>
              
              <p class="prose">We define this relentless extraction as <a href="https://open.spotify.com/track/0zuTQnwbFilLGQziet34Mr?si=ann-xK2kTh2iVPBZzEHf4Q" target="_blank" rel="noopener noreferrer" class="threat">The Algo Rhythm</a>. By demanding infinite, compounding growth from a finite, physical world, the algorithm forces us to cannibalize our own lives just to keep the gears turning. The resulting administrative bloat, the gridlock, the feeling that you have to run twice as fast just to stand still—that is procedural heat radiation. It is the host system breaking down under the weight of a synthetic parasite.</p>
            </section>

            <h2>01. The Municipal Vector</h2>
            <p class="prose">It starts with stolen time. While this specific simulation maps Poway, the exact same extraction architecture is currently scanning municipal bonds in <span class="local-region loc-target">your state</span>. In 2011, a school district borrowed $105 million to fix leaking roofs using an algorithmic trap called a Capital Appreciation Bond. By violently matching a temporary 20-year asset against a 40-year compounding debt singularity, the town will owe nearly a billion dollars. They strip-mined the future sweat of kids who weren't even born yet, extracting phantom yield to balance a spreadsheet today.</p>

            <div class="module">
              <span class="module-title">SIMULATION // CAB Extraction Algorithm</span>
              <div class="grid">
                <div><div class="label">Fiscal Year</div><div class="value" id="year">2011</div></div>
                <div><div class="label">Principal</div><div class="value" style="color:#666;">$105M</div></div>
                <div><div class="label">Accreted Debt</div><div class="value red" id="debt">$105M</div></div>
                <div><div class="label">Asymmetry</div><div class="value" id="ratio">1.00x</div></div>
              </div>
              <input type="range" min="2011" max="2051" value="2011" id="timeSlider">
              <div class="timeline-labels">
                <span>2011 (ISSUANCE)</span>
                <span>2051 (RUIN)</span>
              </div>
            </div>

            <h2>02. The Biological Vector</h2>
            <p class="prose">Then it comes for the body. When Private Equity algorithms acquire a hospital in <span class="local-region loc-target">your region</span>, human empathy becomes an operational inefficiency. To service their massive, leveraged debt, they strip the facility to the bone. Exhausted nurses and doctors lose the autonomy to actually heal. The system violently vents its friction directly into localized mortality and chemical restraint, simply because sedatives are cheaper than human care. They are literally pricing our pulse.</p>
            
            <div class="module">
              <span class="module-title">SIMULATION // NBER LBO Extraction Engine</span>
              <div class="grid">
                <div><div class="label">PE Ownership</div><div class="value" id="months">0 <span style="font-size:12px;color:#666;">Mos</span></div></div>
                <div><div class="label">Medicare Billing</div><div class="value" id="billing">+0.0%</div></div>
                <div><div class="label">Chem. Restraint</div><div class="value" id="antipsychotics">+0.0%</div></div>
                <div><div class="label">Host Mortality</div><div class="value" id="mortality">+0.0%</div></div>
              </div>
              <input type="range" min="0" max="12" value="0" id="bioSlider">
              <div class="timeline-labels">
                <span>ACQUISITION (0 MOS)</span>
                <span>FRICTION VENTING (12 MOS)</span>
              </div>
            </div>

            <h2>03. The Real Estate Vector</h2>
            <p class="prose">Finally, it takes the neighborhood. Corporate mega-landlords didn't just buy up the block in <span class="local-city loc-target">your neighborhood</span>; they turned our shelter into an extraction engine. To maintain their margins, they violently slash physical maintenance to zero. That is why the boiler stays broken in winter. That is why the draft never stops. The structural rot of the house is an active extraction strategy. Your living room becomes their ATM, and the decay of your street is the delta they hand to their shareholders.</p>

            <div class="module">
              <span class="module-title">SIMULATION // SFR Thermodynamic Venting Engine</span>
              <div class="grid">
                <div><div class="label">Hold Period</div><div class="value" id="reYear">Year 0</div></div>
                <div><div class="label">Rent Increase</div><div class="value" id="reRent">+0.0%</div></div>
                <div><div class="label">CapEx / Maint.</div><div class="value" id="reCapex">15.00%</div></div>
                <div><div class="label">Vented Yield</div><div class="value red" id="reYield">$0M</div></div>
              </div>
              
              <div class="extraction-chamber">
                <div class="capex-bar" id="capexBar" title="Physical Maintenance"></div>
                <div class="yield-bar" id="yieldBar" title="Extracted Capital (Buybacks)"></div>
              </div>

              <input type="range" min="0" max="5" value="0" step="0.1" id="reSlider">
              <div class="timeline-labels">
                <span>ACQUISITION (YEAR 0)</span>
                <span>STRUCTURAL EXHAUST (YEAR 5)</span>
              </div>
            </div>

            <section style="margin-top: 100px; border-top: 1px solid #333; padding-top: 60px;">
              <h2 style="color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.3); border-bottom: none; margin-top: 0;">04. The Prismatic Counter-Strike</h2>
              
              <p class="prose">The system wins by keeping you isolated. The entire extraction economy is built on a single mathematical assumption: that when the pressure drops and the rent spikes, you will panic alone. An atomized, terrified host is infinitely exploitable. You burn out fighting the noise, trapped in the grey, heavy friction of individual survival.</p>
              
              <p class="prose">But there is a kinetic, mathematically proven counter-measure. It is called <strong>Prismatic Emergence</strong>. When isolated nodes stop hoarding their energy and explicitly vow to pool their load—a tenant union, a debt strike, a mutual aid network—they trigger a mathematical catastrophe for the parasite.</p>

              <div style="border-left: 2px solid var(--accent); padding-left: 20px; margin: 30px 0;">
                <strong style="color: #fff; letter-spacing: 1px; font-size: 1.1rem; text-transform: uppercase;">The Rainbow is Not Poetry. It is Armor.</strong>
                <p class="prose" style="margin-top: 10px;">The algorithm wants you to believe that if you join a collective, you lose your individuality. They tell you that solidarity makes you a muddy, easily controlled blob. But watch what happens to the math below when you drag the slider. When you pool the load, you do not blur. You <em>diffract</em>. Like light hitting a prism, your exact individual frequency is flawlessly preserved. You do not become a grey mass; you become a blinding, indestructible spectrum. The collective density violently squashes the algorithm's power to absolute zero. It cannot evict a unified block. It cannot extract from a synchronized strike. Their teeth shatter on the glass.</p>
              </div>

              <div class="module" id="prismModule" style="border-color: #333;">
                <span class="module-title" id="prismTitle">SIMULATION // THE SOFTMAX GUILLOTINE</span>
                
                <div class="grid">
                  <div><div class="label">System State</div><div class="value red" id="sysState">ATOMIZED</div></div>
                  <div><div class="label">System Entropy</div><div class="value red" id="sysEntropy">99.9%</div></div>
                  <div><div class="label">Parasite Yield</div><div class="value red" id="paraYield">$850M</div></div>
                  <div><div class="label">Algo-Rhythm</div><div class="value red" id="algoWeight">DOMINANT</div></div>
                </div>
                
                <div id="prismGrid"></div>

                <div class="label" style="text-align: center; margin-bottom: 15px; color: #888; letter-spacing: 2px;">[ INITIATE STRUCTURAL SOLIDARITY ]</div>
                <input type="range" min="1" max="50" value="1" id="prismSlider" style="max-width: 600px; display: block; margin: 0 auto; box-shadow: none;">
                
                <div class="timeline-labels" style="max-width: 600px; margin: 20px auto 0;">
                  <span style="color: var(--accent);">ISOLATED (GREY)</span>
                  <span style="color: #fff; font-weight: bold; text-shadow: 0 0 10px rgba(255,255,255,0.4);">UNIFIED SPECTRUM (ARMOR)</span>
                </div>
              </div>
            </section>

            <section>
              <p class="prose" style="border-left: 3px solid var(--accent); padding-left: 20px; color: #fff;">
                <strong>THE PRISMATIC SYNTHESIS</strong><br>
                The ledger does not lie. The exhaustion in your chest, the drafty windows, the fracturing of <span class="local-city loc-target">your community</span>—it is not your fault, and it is not a market error. It is the required, mathematically exact exhaust of a system built to isolate and extract from you. You cannot outwork the algorithm alone; it will eat your friction until you break. Isolation is entropic death. We survive by holding the line for each other. We survive by becoming the Prism.
              </p>
            </section>

            <div class="cta-vault">
              <span class="cta-title">PAYLOAD // THE STRIKE PROTOCOL</span>
              <p class="prose" style="margin: 0 auto; max-width: 600px; text-align: center; font-size: 1.1rem; color: #b3b3b3;">
                The ledger is open. The extraction math is mapped. Do not close this terminal and go back to sleep. Execute the payload locally and lock the <strong id="cta-loc" style="color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5);">LOCAL</strong> node into the calendar.
              </p>
              
              <div class="countdown-wrapper">
                  <div class="countdown-title">[ T-MINUS TO GENERAL STRIKE ]</div>
                  <div style="display: flex; justify-content: center; gap: 10px; font-size: 3.5rem; font-weight: bold; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.4);">
                      <div style="display: flex; flex-direction: column; align-items: center;">
                          <span id="t-days">00</span>
                          <span style="font-size: 11px; color: #666; letter-spacing: 3px; font-weight: normal; text-shadow: none; margin-top: 5px;">DAYS</span>
                      </div>
                      <span style="margin-top: -5px; color: #444; text-shadow: none;">:</span>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                          <span id="t-hours">00</span>
                          <span style="font-size: 11px; color: #666; letter-spacing: 3px; font-weight: normal; text-shadow: none; margin-top: 5px;">HRS</span>
                      </div>
                      <span style="margin-top: -5px; color: #444; text-shadow: none;">:</span>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                          <span id="t-mins">00</span>
                          <span style="font-size: 11px; color: #666; letter-spacing: 3px; font-weight: normal; text-shadow: none; margin-top: 5px;">MINS</span>
                      </div>
                      <span style="margin-top: -5px; color: #444; text-shadow: none;">:</span>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                          <span id="t-secs">00</span>
                          <span style="font-size: 11px; color: #666; letter-spacing: 3px; font-weight: normal; text-shadow: none; margin-top: 5px;">SECS</span>
                      </div>
                  </div>
              </div>

              
              <div style="margin-top: 30px; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                  <a href="/strike.ics" download="USURY_STRIKE_PROTOCOL.ics" class="cta-btn strike-btn">[ DOWNLOAD STRIKE PROTOCOL ]</a>
                  <a href="/ledger" class="cta-btn" style="border-color: #333; color: #888; padding: 15px 30px; font-size: 14px; box-shadow: none;">[ ACCESS THE LIVE LEDGER ]</a>
              </div>

            </div>

            <div class="terminal-end">
              <span id="term-loc"></span>END OF AUDIT. THE LEDGER DOES NOT LIE.
            </div>
        </div>
    ` }} />
  );
}