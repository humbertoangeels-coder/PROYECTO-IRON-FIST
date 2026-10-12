/**
 * ============================================================================
 * IRON FIST - NIVEL 3 (FINAL)
 * ============================================================================
 * V4.0: Láser en abanico (Triple), Vidas, Power-Ups y High Score.
 */

let Tiempolvl3 = 50; let Puntajelvl3 = 0; const metaPuntosLvl3 = 40; 
let nivel3Terminado = false; let isPaused3 = false; let juegoIniciadoLvl3 = false;
let VidasLvl3 = 3;

let keys3 = {};
document.addEventListener('keydown', (e) => {
    if (e.key === " ") e.preventDefault(); 
    if (!nivel3Terminado && !isPaused3 && document.getElementById("NIVEL3").style.display !== "none") {
        keys3[e.key.toLowerCase()] = true;
    }
});
document.addEventListener('keyup', (e) => { keys3[e.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { keys3 = {}; });

function crearTextoPunto3(x, y, contenedor, color, texto = "+1") {
    let txt = document.createElement('div'); txt.innerText = texto; 
    txt.className = texto === "+1" ? "PuntoFlotante" : "TextoPoder";
    txt.style.color = color; txt.style.textShadow = "0 0 10px " + color;
    let rectCont = contenedor.getBoundingClientRect();
    txt.style.left = (x - rectCont.left) + 'px'; txt.style.top = (y - rectCont.top) + 'px';
    contenedor.appendChild(txt); setTimeout(() => txt.remove(), 1000);
}

let Restar_Tiempolvl3, loopJuego3;
let spawnTimeouts3 = []; let spawnIntervals3 = [];
let arrayPowerUps3 = [];
let tiempoRecargaLaser3 = 200;

const meteoritos3 = ['Meteoritolvl3', 'Meteorito2lvl3', 'Meteorito3lvl3', 'Meteorito4lvl3', 'Meteorito5lvl3', 'Meteorito6lvl3', 'Meteorito7lvl3', 'Meteorito8lvl3'];
const configOleada3 = [
    { id: 'Meteoritolvl3', delay: 2200, freq: 2600, vel: 2.5 },
    { id: 'Meteorito2lvl3', delay: 2660, freq: 2650, vel: 2.5 },
    { id: 'Meteorito3lvl3', delay: 2900, freq: 2550, vel: 2.5 },
    { id: 'Meteorito4lvl3', delay: 3100, freq: 2500, vel: 2.5 },
    { id: 'Meteorito5lvl3', delay: 3400, freq: 2450, vel: 2.5 },
    { id: 'Meteorito6lvl3', delay: 3700, freq: 2700, vel: 2.5 },
    { id: 'Meteorito7lvl3', delay: 4100, freq: 2400, vel: 2.5 },
    { id: 'Meteorito8lvl3', delay: 4500, freq: 2600, vel: 2.5 }
];

function getDimensiones3() { return { limiteX: document.querySelector('.Contenedorlvl3').offsetWidth * 0.70, alturaMax: document.querySelector('.Contenedorlvl3').offsetHeight - 70 }; }

function crearExplosion3(x, y, contenedor) {
    let exp = document.createElement('div'); exp.classList.add('Explosion');
    let rectCont = contenedor.getBoundingClientRect();
    exp.style.left = (x - rectCont.left - 10) + 'px'; exp.style.top = (y - rectCont.top - 10) + 'px';
    contenedor.appendChild(exp); setTimeout(() => exp.remove(), 400);
}

function soltarPowerUp3(x, y, tablero) {
    if (Math.random() > 0.15) return; 
    let tipos = [
        { clase: 'Poder-Rapido', icono: 'fa-bolt', nombre: 'AMETRALLADORA' },
        { clase: 'Poder-Escudo', icono: 'fa-shield-alt', nombre: 'ESCUDO MAX' },
        { clase: 'Poder-Bomba', icono: 'fa-bomb', nombre: 'BOMBA NOVA' }
    ];
    let poder = tipos[Math.floor(Math.random() * tipos.length)];
    let pUp = document.createElement("div"); pUp.className = "PowerUp " + poder.clase; pUp.innerHTML = `<i class="fas ${poder.icono}"></i>`;
    let rectCont = tablero.getBoundingClientRect(); let startX = x - rectCont.left; let startY = y - rectCont.top;
    pUp.style.left = startX + "px"; pUp.style.top = startY + "px";
    tablero.appendChild(pUp); arrayPowerUps3.push({ element: pUp, x: startX, y: startY, tipo: poder.nombre });
}

function JUEGOlvl3() {
    nivel3Terminado = false; isPaused3 = false; keys3 = {}; tiempoRecargaLaser3 = 200;
    arrayPowerUps3.forEach(p => { if(p.element) p.element.remove(); }); arrayPowerUps3 = [];

    let tablero = document.querySelector('.Contenedorlvl3');
    let nave3 = document.getElementById("NaveJugador3"); nave3.style.opacity = "1";

    VidasLvl3 = 3;
    document.getElementById("corazon1_lvl3").classList.remove("perdida");
    document.getElementById("corazon2_lvl3").classList.remove("perdida");
    document.getElementById("corazon3_lvl3").classList.remove("perdida");

    let esInvulnerable = true; nave3.classList.add("NaveInvulnerable");
    let timerEscudo3 = setTimeout(() => { esInvulnerable = false; nave3.classList.remove("NaveInvulnerable"); }, 2500);

    let posX3 = tablero.offsetWidth * 0.55; let posY3 = tablero.offsetHeight / 2;
    const velocidadNave3 = 12; let lasers3 = []; let puedeDisparar3 = true;

    Restar_Tiempolvl3 = setInterval(() => {
        if (nivel3Terminado || isPaused3) return; Tiempolvl3--;
        let relojDom = document.getElementById("Tiempolvl3"); relojDom.innerHTML = Tiempolvl3;
        if (Tiempolvl3 <= 10) relojDom.classList.add("Frenesi"); else relojDom.classList.remove("Frenesi");
        if (Tiempolvl3 <= 0) { Game_Over_3("EL TIEMPO SE AGOTÓ."); }
    }, 1000);

    function dispararLaser3() {
        puedeDisparar3 = false;
        let laserY = posY3 + (nave3.offsetHeight / 2) - 3; let laserX = posX3 - 10;
        
        let lCenter = document.createElement("div"); lCenter.classList.add("Laser3"); lCenter.style.left = laserX + "px"; lCenter.style.top = laserY + "px"; tablero.appendChild(lCenter);
        lasers3.push({ element: lCenter, x: laserX, y: laserY, velY: 0 }); 

        let lUp = document.createElement("div"); lUp.classList.add("Laser3"); lUp.style.left = laserX + "px"; lUp.style.top = (laserY - 20) + "px"; tablero.appendChild(lUp);
        lasers3.push({ element: lUp, x: laserX, y: laserY - 20, velY: -4 }); 

        let lDown = document.createElement("div"); lDown.classList.add("Laser3"); lDown.style.left = laserX + "px"; lDown.style.top = (laserY + 20) + "px"; tablero.appendChild(lDown);
        lasers3.push({ element: lDown, x: laserX, y: laserY + 20, velY: 4 }); 

        setTimeout(() => puedeDisparar3 = true, tiempoRecargaLaser3); 
    }

    function RecibirDano3(rectNave) {
        if (esInvulnerable) return;
        VidasLvl3--;
        crearExplosion3(rectNave.left, rectNave.top, tablero);
        let s = document.getElementById("Perdiste_sound"); if(s) { s.currentTime = 0; s.play().catch(()=>{}); }
        tablero.classList.add("PantallaDano"); setTimeout(() => tablero.classList.remove("PantallaDano"), 300);

        let corazon = document.getElementById("corazon" + (VidasLvl3 + 1) + "_lvl3");
        if(corazon) corazon.classList.add("perdida");

        if (VidasLvl3 <= 0) { Game_Over_3("NAVE DESTRUIDA EN LA RONDA FINAL."); } 
        else {
            esInvulnerable = true; nave3.classList.add("NaveInvulnerable"); clearTimeout(timerEscudo3);
            timerEscudo3 = setTimeout(() => { esInvulnerable = false; nave3.classList.remove("NaveInvulnerable"); }, 2000);
        }
    }

    function activarPoder3(tipo, x, y) {
        let sound = document.getElementById("Puntos_sound"); if(sound) { sound.currentTime = 0; sound.play().catch(()=>{}); }
        if (tipo === 'AMETRALLADORA') {
            crearTextoPunto3(x, y, tablero, "#00ff00", "¡AMETRALLADORA!");
            tiempoRecargaLaser3 = 60; setTimeout(() => { tiempoRecargaLaser3 = 200; }, 5000);
        } else if (tipo === 'ESCUDO MAX') {
            crearTextoPunto3(x, y, tablero, "#0096ff", "¡ESCUDO MAX!");
            esInvulnerable = true; nave3.classList.add("NaveInvulnerable"); clearTimeout(timerEscudo3);
            timerEscudo3 = setTimeout(() => { esInvulnerable = false; nave3.classList.remove("NaveInvulnerable"); }, 6000);
        } else if (tipo === 'BOMBA NOVA') {
            crearTextoPunto3(x, y, tablero, "#9600ff", "¡NOVA!");
            tablero.classList.add("PantallaDano"); setTimeout(() => tablero.classList.remove("PantallaDano"), 300);
            meteoritos3.forEach(id => {
                let met = document.getElementById(id);
                if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                    let rM = met.getBoundingClientRect(); crearExplosion3(rM.left, rM.top, tablero);
                    Explulsarlvl3(id); Aumentar_Puntoslvl3();
                }
            });
        }
    }

    function loopPrincipal3() {
        if (nivel3Terminado || isPaused3) return;

        let velActual = keys3['shift'] ? velocidadNave3 * 1.8 : velocidadNave3;
        if (keys3['shift']) { nave3.classList.add("NaveBoost"); } else { nave3.classList.remove("NaveBoost"); }

        let dx = 0; let dy = 0;
        if (keys3['w'] || keys3['arrowup']) dy -= velActual;
        if (keys3['s'] || keys3['arrowdown']) dy += velActual;
        if (keys3['a'] || keys3['arrowleft']) dx -= velActual;
        if (keys3['d'] || keys3['arrowright']) dx += velActual;

        posX3 += dx; posY3 += dy;

        let dim = getDimensiones3();
        if (posX3 < 0) posX3 = 0; if (posY3 < 0) posY3 = 0; if (posY3 > dim.alturaMax) posY3 = dim.alturaMax;
        nave3.style.left = posX3 + "px"; nave3.style.top = posY3 + "px";

        if (keys3[' '] && puedeDisparar3) { dispararLaser3(); }

        let rectNave = nave3.getBoundingClientRect();
        let hitboxNave = { left: rectNave.left + 25, right: rectNave.right - 25, top: rectNave.top + 25, bottom: rectNave.bottom - 25 };

        for (let i = arrayPowerUps3.length - 1; i >= 0; i--) {
            let p = arrayPowerUps3[i]; if(!p || !p.element) { arrayPowerUps3.splice(i, 1); continue; }
            p.x -= 3; p.element.style.left = p.x + "px";
            let rectP = p.element.getBoundingClientRect();
            if (hitboxNave.left < rectP.right && hitboxNave.right > rectP.left && hitboxNave.top < rectP.bottom && hitboxNave.bottom > rectP.top) {
                activarPoder3(p.tipo, rectP.left, rectP.top);
                p.element.remove(); arrayPowerUps3.splice(i, 1);
            } else if (p.x < -100) { p.element.remove(); arrayPowerUps3.splice(i, 1); }
        }

        for (let i = lasers3.length - 1; i >= 0; i--) {
            let l = lasers3[i]; 
            if (!l || !l.element || typeof l.x === 'undefined') { lasers3.splice(i, 1); continue; }

            l.x -= 30; l.y += l.velY; 
            l.element.style.left = l.x + "px"; l.element.style.top = l.y + "px";
            let rectLaser = l.element.getBoundingClientRect(); let laserGolpeo = false;

            meteoritos3.forEach(id => {
                let met = document.getElementById(id);
                if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                    let rM = met.getBoundingClientRect();
                    if (rectLaser.left < rM.right && rectLaser.right > rM.left && rectLaser.top < rM.bottom && rectLaser.bottom > rM.top) {
                        crearExplosion3(rM.left, rM.top, tablero); crearTextoPunto3(rM.left, rM.top, tablero, "#ffaa00");
                        soltarPowerUp3(rM.left, rM.top, tablero);
                        Explulsarlvl3(id); Aumentar_Puntoslvl3(); laserGolpeo = true;
                    }
                }
            });
            if (laserGolpeo || l.x < -100 || l.y < -50 || l.y > window.innerHeight) { l.element.remove(); lasers3.splice(i, 1); }
        }

        meteoritos3.forEach(id => {
            let met = document.getElementById(id);
            if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                let rM = met.getBoundingClientRect();
                if (rM.left > dim.limiteX + 10) { Game_Over_3("EL ENJAMBRE COLISIONÓ CON LA TIERRA."); }
                else if (hitboxNave.left < rM.right && hitboxNave.right > rM.left && hitboxNave.top < rM.bottom && hitboxNave.bottom > rM.top) {
                    RecibirDano3(rectNave);
                }
            }
        });
    }
    loopJuego3 = setInterval(loopPrincipal3, 30);

    document.getElementById("Pauselvl3").onclick = function() {
        if (nivel3Terminado) return; isPaused3 = !isPaused3;
        if (isPaused3) {
            document.getElementById("Pausa_Pantallalvl3").style.display = "flex"; let mf = document.getElementById("Fondo_Ciberpunk"); if (mf) mf.pause();
            meteoritos3.forEach(id => { let el = document.getElementById(id); if(el) { let comp = window.getComputedStyle(el); el.style.left = comp.left; el.style.transition = "none"; } });
            arrayPowerUps3.forEach(p => { if(p.element) { let comp = window.getComputedStyle(p.element); p.element.style.left = comp.left; p.element.style.transition = "none"; } });
        } else { 
            document.getElementById("Pausa_Pantallalvl3").style.display = "none"; let mf = document.getElementById("Fondo_Ciberpunk"); if (mf) { let p = mf.play(); if(p!==undefined) p.catch(()=>{}); }
            meteoritos3.forEach(id => { let el = document.getElementById(id); if(el && el.style.left !== "-500px" && el.style.left !== "-70%") { el.style.transition = "2.5s linear"; el.style.left = "80%"; } });
        }
    };

    function Aumentar_Puntoslvl3() {
        if (nivel3Terminado || isPaused3) return;
        Puntajelvl3++; document.getElementById("Puntajelvl3").innerHTML = Puntajelvl3 + " / " + metaPuntosLvl3;
        if (Puntajelvl3 >= metaPuntosLvl3) { terminarJuegoLvl3(); }
    }

    function terminarJuegoLvl3() {
        nivel3Terminado = true; keys3 = {}; Puntajelvl3 = 0; detenerMeteoritosLvl3();

        let cabezera = document.querySelector('.Cabezeralvl3'); if (cabezera) cabezera.style.opacity = "0";
        let cajaInf = document.querySelector('.Contenedor_LVL'); if (cajaInf) cajaInf.style.opacity = "0";
        let fC = document.getElementById("Fondo_Ciberpunk"); if (fC) fC.pause();

        let puntosBase = (15 + 25 + 40) * 100; 
        let bonoTiempo = Tiempolvl3 * 50; 
        let bonoVidas = VidasLvl3 * 1000;
        let puntajeFinal = puntosBase + bonoTiempo + bonoVidas;

        let recordGuardado = localStorage.getItem('IronFist_HighScore') || 0;
        let mensajeRecord = "";

        if (puntajeFinal > recordGuardado) {
            localStorage.setItem('IronFist_HighScore', puntajeFinal);
            document.getElementById("Texto_HighScore").innerText = puntajeFinal + " PTS";
            mensajeRecord = '<br><br><b style="color:#ffaa00; text-shadow:0 0 10px #ffaa00;">¡NUEVO RÉCORD SUPREMO ESTABLECIDO!</b>';
        }

        Swal.fire({
            title : '¡VICTORIA ABSOLUTA!', 
            html: `<b style="color: cyan;">La Tierra está a salvo. El enjambre ha sido destruido por completo.</b><br><br>
                   Puntos Base: <b>${puntosBase}</b><br>
                   Bono Tiempo: <b>${bonoTiempo}</b><br>
                   Bono Vidas: <b>${bonoVidas}</b><br>
                   <h3 style="color: #00ffcc; margin-top:15px;">PUNTAJE FINAL: ${puntajeFinal}</h3>
                   ${mensajeRecord}`,
            icon: 'success', background: '#000', color: '#fff', confirmButtonText: 'RECIBIR HONORES', confirmButtonColor: '#ffaa00', allowOutsideClick: false, customClass: { popup: 'alerta-neon-lvl3' }
        }).then(() => {
            let tS = document.getElementById("Triunfo"); if(tS) { let p1 = tS.play(); if (p1 !== undefined) p1.catch(()=>{}); }
            let mF = document.getElementById("Musica_Final"); if(mF) { let p2 = mF.play(); if (p2 !== undefined) p2.catch(()=>{}); }

            if (nave3) { nave3.style.transition = "left 2s cubic-bezier(0.5, 0, 1, 1)"; nave3.style.left = "150%"; }

            let ovni1 = document.getElementById("Pantalla_Ovnislvl3"); if (ovni1) { ovni1.style.transition = "left 8s linear"; ovni1.style.left = "120%"; }
            let nodriza = document.getElementById("Pantalla_Nodrizalvl3"); if (nodriza) { nodriza.style.transition = "left 10s linear"; nodriza.style.left = "120%"; }
            let ovni2 = document.getElementById("Pantalla_Ovnis2lvl3"); if (ovni2) { ovni2.style.transition = "left 7s linear"; ovni2.style.left = "120%"; }

            let pCred = document.getElementById("Pantalla_creditoslvl3"); 
            if (pCred) { pCred.style.background = "rgba(0,0,0,0.95)"; pCred.style.pointerEvents = "auto"; }
            
            let cred = document.getElementById("Creditoslvl3"); 
            if (cred) { cred.style.top = "100%"; setTimeout(() => { cred.style.transition = "top 12s linear"; cred.style.top = "-50%"; }, 100); }
            
            let prox = document.getElementById("Proximolvl3"); 
            if (prox) { prox.style.bottom = "-50%"; setTimeout(() => { prox.style.transition = "bottom 15s linear"; prox.style.bottom = "50%"; }, 5000); }
        });
    }

    function Game_Over_3(razon) {
        if(nivel3Terminado) return; nivel3Terminado = true; keys3 = {}; detenerMeteoritosLvl3();
        document.getElementById("Tablero_Juegolvl3").classList.add("shake-anim"); setTimeout(() => document.getElementById("Tablero_Juegolvl3").classList.remove("shake-anim"), 500);
        let s = document.getElementById("Perdiste_sound"); if(s) { s.currentTime = 0; let p = s.play(); if (p !== undefined) p.catch(()=>{}); }
        
        Swal.fire({
            title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff3300; font-size: 24px;">¡LA TIERRA FUE DESTRUIDA!</span>',
            html: '<b style="color:white; font-size: 16px;">' + razon + '</b>',
            icon: 'error', background: 'rgba(15, 0, 0, 0.95)', color: '#fff', confirmButtonText: 'ÚLTIMO INTENTO', confirmButtonColor: '#ff3300', allowOutsideClick: false
        }).then(() => { Tiempolvl3 = 50; Puntajelvl3 = 0; document.getElementById("Puntajelvl3").innerHTML = "0 / " + metaPuntosLvl3; document.getElementById("Tiempolvl3").classList.remove("Frenesi"); JUEGOlvl3(); });
    }

    function detenerMeteoritosLvl3() {
        spawnIntervals3.forEach(clearInterval); spawnIntervals3 = [];
        spawnTimeouts3.forEach(clearTimeout); spawnTimeouts3 = [];
        clearInterval(Restar_Tiempolvl3); clearInterval(loopJuego3);
        meteoritos3.forEach(id => { let el = document.getElementById(id); if(el) { el.style.transition = "0s"; el.style.left = "-70%"; } });
        lasers3.forEach(l => { if (l && l.element) l.element.remove(); }); lasers3 = [];
        arrayPowerUps3.forEach(p => { if(p.element) p.element.remove(); }); arrayPowerUps3 = [];
    }

    function iniciarTrayectoriaLvl3(id, velocidad) {
        if (nivel3Terminado || isPaused3) return;
        let el = document.getElementById(id);
        if(el){ let dim = getDimensiones3(); let altura = Math.round(Math.random() * dim.alturaMax); el.style.left = "80%"; el.style.top = altura + "px"; el.style.transition = velocidad + "s linear"; }
    }

    configOleada3.forEach(m => {
        spawnTimeouts3.push(setTimeout(() => iniciarTrayectoriaLvl3(m.id, m.vel), m.delay));
        spawnIntervals3.push(setInterval(() => iniciarTrayectoriaLvl3(m.id, m.vel), m.freq));
    });

    function Explulsarlvl3(id) {
        const sonidos = ["Puntos_sound", "Punto2", "Punto3", "Punto4"];
        let randomSound = sonidos[Math.floor(Math.random() * sonidos.length)];
        let sound = document.getElementById(randomSound);
        if(sound) { sound.currentTime = 0; let p = sound.play(); if (p !== undefined) p.catch(()=>{}); }
        let el = document.getElementById(id); let dim = getDimensiones3(); let altura = Math.round(Math.random() * dim.alturaMax);
        el.style.left = "-500px"; el.style.top = altura + "px"; el.style.transition = "1.7s";
    }
}

function PLAYlvl3() {
    if (juegoIniciadoLvl3) return; juegoIniciadoLvl3 = true; let Conteolvl3 = 4;
    let mf = document.getElementById("Fondo_Ciberpunk"); if (mf) { let p = mf.play(); if(p!==undefined) p.catch(()=>{}); }
    
    document.querySelector("#NIVEL3 .Contenedor_Mensaje_Star").style.display = "none";

    setTimeout(JUEGOlvl3, 4100);
    let cuentaRegresiva = setInterval(() => { Conteolvl3--; document.getElementById("RGBlvl3").innerHTML = Conteolvl3;
        if (Conteolvl3 === -1) { clearInterval(cuentaRegresiva); document.getElementById("Contenedor_contadorlvl3").style.display = "none"; document.getElementById("Startlvl3").style.display = "none"; }
    }, 1000);
}