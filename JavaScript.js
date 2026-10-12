/**
 * ============================================================================
 * IRON FIST - SCRIPT PRINCIPAL Y NIVEL 1
 * ============================================================================
 * V4.0: Sistema de Récords, Vidas y NUEVO SISTEMA DE POWER-UPS.
 */

window.onload = function() {
    let recordGuardado = localStorage.getItem('IronFist_HighScore') || 0;
    let txtRecord = document.getElementById("Texto_HighScore");
    if(txtRecord) txtRecord.innerText = recordGuardado + " PTS";
};

Swal.fire({
    title: '<span style="font-family: \'Press Start 2P\', cursive; color: #00d2ff; text-shadow: 0 0 10px #00d2ff; font-size: 18px; line-height: 1.5;">¿PREPARADO PARA SALVAR EL MUNDO?</span>',
    html: '<div style="font-family: sans-serif; color: #e0e0e0; font-size: 14px; line-height: 1.6; padding: 10px;">Usa W, A, S, D o las flechas para moverte.<br><br><b style="color:#00d2ff">Presiona ESPACIO para disparar.</b><br><br>Atrapa las <b style="color:#00ff00">Cajas Brillantes</b> para obtener poderes. Tienes <b>3 VIDAS</b>.</div>',
    imageUrl: 'IMG/planeta_tierra.png', imageWidth: 120, imageAlt: 'Planeta Tierra',
    background: 'rgba(0, 5, 15, 0.95)', color: '#fff', backdrop: 'rgba(0, 210, 255, 0.15)',
    confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">ESTOY PREPARADO</span>',
    confirmButtonColor: '#00d2ff', width: '50%', padding: '2em', allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false, stopKeydownPropagation: false, customClass: { popup: 'alerta-neon-intro' }
});

let Tiempo = 71; let Puntaje = 0; const metaLvl1 = 15; 
let nivel1Terminado = false; let isPaused1 = false; let juegoIniciadoLvl1 = false;
let VidasLvl1 = 3; 
let tiempoRecargaLaser = 300; // Control dinámico de disparo

let keys1 = {};
document.addEventListener('keydown', (e) => {
    if (e.key === " ") e.preventDefault(); 
    if (!nivel1Terminado && !isPaused1 && document.getElementById("NIVEL_01").style.display !== "none") {
        keys1[e.key.toLowerCase()] = true;
    }
});
document.addEventListener('keyup', (e) => { keys1[e.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { keys1 = {}; });

function crearTextoPunto(x, y, contenedor, color, texto = "+1") {
    let txt = document.createElement('div'); txt.innerText = texto; 
    txt.className = texto === "+1" ? "PuntoFlotante" : "TextoPoder";
    txt.style.color = color; txt.style.textShadow = "0 0 10px " + color;
    let rectCont = contenedor.getBoundingClientRect();
    txt.style.left = (x - rectCont.left) + 'px'; txt.style.top = (y - rectCont.top) + 'px';
    contenedor.appendChild(txt); setTimeout(() => txt.remove(), 1000);
}

let Narracion = 1;
document.getElementById("Contenedor_narracion").addEventListener('click', () => {
    if (Narracion === 1) { document.getElementById("narracion").play(); document.getElementById("VOLUMEN").style.display = "none"; document.getElementById("PAUSE").style.display = "table"; Narracion = 2;
    } else { document.getElementById("narracion").pause(); document.getElementById("VOLUMEN").style.display = "table"; document.getElementById("PAUSE").style.display = "none"; Narracion = 1; }
});
let Graficos = 1;
function Graficos_fondo() {
    if (Graficos === 1) { document.getElementById("Recursos").style.marginLeft = "60%"; document.getElementById("Fondo").style.background = "url(IMG/Fondo_Espacio2.jpg)"; document.getElementById("Fondo").style.backgroundAttachment = "fixed"; document.getElementById("Fondo").style.backgroundSize = "cover"; Graficos = 2;
    } else { document.getElementById("Recursos").style.marginLeft = "0%"; document.getElementById("Fondo").style.backgroundImage = "url(IMG/Fondo_Espacio.gif)"; Graficos = 1; }
}

let Restar_Tiempo, loopJuego1; 
let spawnTimeouts1 = []; let spawnIntervals1 = [];
let arrayPowerUps = []; // Arreglo para controlar las cajas en pantalla

const meteoritos = ['Meteiorito', 'Meteiorito2', 'Meteiorito3', 'Meteiorito4'];
const configOleada1 = [
    { id: 'Meteiorito', delay: 2000, freq: 3600, vel: 3.5 },
    { id: 'Meteiorito2', delay: 2600, freq: 3500, vel: 3.5 },
    { id: 'Meteiorito3', delay: 3200, freq: 3800, vel: 3.5 },
    { id: 'Meteiorito4', delay: 4000, freq: 3400, vel: 3.5 }
];

function getDimensiones1() { return { limiteX: document.querySelector('.Contenedor').offsetWidth * 0.70, alturaMax: document.querySelector('.Contenedor').offsetHeight - 80 }; }

function crearExplosion(x, y, contenedor) {
    let exp = document.createElement('div'); exp.classList.add('Explosion');
    let rectCont = contenedor.getBoundingClientRect();
    exp.style.left = (x - rectCont.left - 10) + 'px'; exp.style.top = (y - rectCont.top - 10) + 'px';
    contenedor.appendChild(exp); setTimeout(() => exp.remove(), 400);
}

// ===============================================
// SISTEMA DE POWER-UPS (Generación y Lógica)
// ===============================================
function soltarPowerUp(x, y, tablero) {
    let probabilidad = Math.random();
    if (probabilidad > 0.15) return; // 15% de probabilidad de soltar algo

    let tipos = [
        { clase: 'Poder-Rapido', icono: 'fa-bolt', nombre: 'AMETRALLADORA' },
        { clase: 'Poder-Escudo', icono: 'fa-shield-alt', nombre: 'ESCUDO MAX' },
        { clase: 'Poder-Bomba', icono: 'fa-bomb', nombre: 'BOMBA NOVA' }
    ];
    let poderElegido = tipos[Math.floor(Math.random() * tipos.length)];

    let pUp = document.createElement("div");
    pUp.className = "PowerUp " + poderElegido.clase;
    pUp.innerHTML = `<i class="fas ${poderElegido.icono}"></i>`;
    
    let rectCont = tablero.getBoundingClientRect();
    let startX = x - rectCont.left; 
    let startY = y - rectCont.top;
    pUp.style.left = startX + "px"; 
    pUp.style.top = startY + "px";
    
    tablero.appendChild(pUp);
    arrayPowerUps.push({ element: pUp, x: startX, y: startY, tipo: poderElegido.nombre });
}

function JUEGO() {
    nivel1Terminado = false; isPaused1 = false; keys1 = {}; tiempoRecargaLaser = 300;
    arrayPowerUps.forEach(p => { if(p.element) p.element.remove(); }); arrayPowerUps = [];
    
    let tablero = document.querySelector('.Contenedor');
    let nave = document.getElementById("NaveJugador1");
    nave.style.opacity = "1"; 

    VidasLvl1 = 3;
    document.getElementById("corazon1_lvl1").classList.remove("perdida");
    document.getElementById("corazon2_lvl1").classList.remove("perdida");
    document.getElementById("corazon3_lvl1").classList.remove("perdida");

    let esInvulnerable = true; nave.classList.add("NaveInvulnerable");
    let timerEscudo = setTimeout(() => { esInvulnerable = false; nave.classList.remove("NaveInvulnerable"); }, 2500);

    let posX = tablero.offsetWidth * 0.55; let posY = tablero.offsetHeight / 2;
    const velocidadNave = 12; 
    let lasers1 = []; let puedeDisparar1 = true;

    Restar_Tiempo = setInterval(() => {
        if (nivel1Terminado || isPaused1) return;
        Tiempo--; document.getElementById("Tiempo").innerHTML = Tiempo;
        if (Tiempo <= 0) { Game_Over_1("EL TIEMPO SE AGOTÓ."); }
    }, 1000);

    function dispararLaser() {
        puedeDisparar1 = false;
        let laser = document.createElement("div"); laser.classList.add("Laser1");
        let laserX = posX - 10; let laserY = posY + (nave.offsetHeight / 2) - 3; 
        laser.style.left = laserX + "px"; laser.style.top = laserY + "px";
        tablero.appendChild(laser); lasers1.push({ element: laser, x: laserX, y: laserY });
        
        // El tiempo de recarga es dinámico (puede bajar a 80ms con Ametralladora)
        setTimeout(() => puedeDisparar1 = true, tiempoRecargaLaser); 
    }

    function RecibirDano(rectNave) {
        if (esInvulnerable) return;
        VidasLvl1--;
        crearExplosion(rectNave.left, rectNave.top, tablero);
        let s = document.getElementById("Perdiste_sound"); if(s) { s.currentTime = 0; s.play().catch(()=>{}); }
        tablero.classList.add("PantallaDano"); setTimeout(() => tablero.classList.remove("PantallaDano"), 300);

        let corazon = document.getElementById("corazon" + (VidasLvl1 + 1) + "_lvl1");
        if(corazon) corazon.classList.add("perdida");

        if (VidasLvl1 <= 0) { Game_Over_1("TU NAVE FUE DESTRUIDA."); } 
        else {
            esInvulnerable = true; nave.classList.add("NaveInvulnerable");
            clearTimeout(timerEscudo);
            timerEscudo = setTimeout(() => { esInvulnerable = false; nave.classList.remove("NaveInvulnerable"); }, 2000);
        }
    }

    /**
     * Aplica el efecto especial del Power-Up recogido
     */
    function activarPoder(tipo, x, y) {
        let sound = document.getElementById("Puntos_sound"); 
        if(sound) { sound.currentTime = 0; sound.play().catch(()=>{}); }

        if (tipo === 'AMETRALLADORA') {
            crearTextoPunto(x, y, tablero, "#00ff00", "¡AMETRALLADORA!");
            tiempoRecargaLaser = 80; // Disparo ultra rápido
            setTimeout(() => { tiempoRecargaLaser = 300; }, 5000); // Dura 5 segundos
        } 
        else if (tipo === 'ESCUDO MAX') {
            crearTextoPunto(x, y, tablero, "#0096ff", "¡ESCUDO MAX!");
            esInvulnerable = true; nave.classList.add("NaveInvulnerable");
            clearTimeout(timerEscudo);
            timerEscudo = setTimeout(() => { esInvulnerable = false; nave.classList.remove("NaveInvulnerable"); }, 6000); // 6 segundos protegido
        } 
        else if (tipo === 'BOMBA NOVA') {
            crearTextoPunto(x, y, tablero, "#9600ff", "¡NOVA!");
            tablero.classList.add("PantallaDano"); setTimeout(() => tablero.classList.remove("PantallaDano"), 300);
            // Destruye todos los meteoritos en pantalla al instante
            meteoritos.forEach(id => {
                let met = document.getElementById(id);
                if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                    let rM = met.getBoundingClientRect();
                    crearExplosion(rM.left, rM.top, tablero);
                    Explulsar(id); Aumentar_Puntos();
                }
            });
        }
    }

    function loopPrincipal1() {
        if (nivel1Terminado || isPaused1) return;

        let velActual = keys1['shift'] ? velocidadNave * 1.8 : velocidadNave;
        if (keys1['shift']) { nave.classList.add("NaveBoost"); } else { nave.classList.remove("NaveBoost"); }

        let dx = 0; let dy = 0;
        if (keys1['w'] || keys1['arrowup']) dy -= velActual;
        if (keys1['s'] || keys1['arrowdown']) dy += velActual;
        if (keys1['a'] || keys1['arrowleft']) dx -= velActual;
        if (keys1['d'] || keys1['arrowright']) dx += velActual;

        posX += dx; posY += dy;

        let dim = getDimensiones1();
        if (posX < 0) posX = 0; if (posY < 0) posY = 0; if (posY > dim.alturaMax) posY = dim.alturaMax;
        nave.style.left = posX + "px"; nave.style.top = posY + "px";

        if (keys1[' '] && puedeDisparar1) { dispararLaser(); }

        let rectNave = nave.getBoundingClientRect();
        let hitboxNave = { left: rectNave.left + 25, right: rectNave.right - 25, top: rectNave.top + 25, bottom: rectNave.bottom - 25 };

        // Físicas de los Power-Ups
        for (let i = arrayPowerUps.length - 1; i >= 0; i--) {
            let p = arrayPowerUps[i];
            if(!p || !p.element) { arrayPowerUps.splice(i, 1); continue; }
            
            p.x -= 3; // El power-up flota hacia la izquierda
            p.element.style.left = p.x + "px";
            let rectP = p.element.getBoundingClientRect();
            
            // Si la nave toca el PowerUp
            if (hitboxNave.left < rectP.right && hitboxNave.right > rectP.left && hitboxNave.top < rectP.bottom && hitboxNave.bottom > rectP.top) {
                activarPoder(p.tipo, rectP.left, rectP.top);
                p.element.remove(); arrayPowerUps.splice(i, 1);
            } 
            // Eliminar si sale de la pantalla
            else if (p.x < -100) { p.element.remove(); arrayPowerUps.splice(i, 1); }
        }

        for (let i = lasers1.length - 1; i >= 0; i--) {
            let l = lasers1[i];
            if (!l || !l.element || typeof l.x === 'undefined') { lasers1.splice(i, 1); continue; }
            
            l.x -= 30; l.element.style.left = l.x + "px";
            let rectLaser = l.element.getBoundingClientRect(); let laserGolpeo = false;

            meteoritos.forEach(id => {
                let met = document.getElementById(id);
                if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                    let rM = met.getBoundingClientRect();
                    if (rectLaser.left < rM.right && rectLaser.right > rM.left && rectLaser.top < rM.bottom && rectLaser.bottom > rM.top) {
                        crearExplosion(rM.left, rM.top, tablero); 
                        crearTextoPunto(rM.left, rM.top, tablero, "#00ffcc");
                        
                        // AL DESTRUIR, INTENTAR SOLTAR POWER-UP
                        soltarPowerUp(rM.left, rM.top, tablero);

                        Explulsar(id); Aumentar_Puntos(); laserGolpeo = true;
                    }
                }
            });
            if (laserGolpeo || l.x < -100) { l.element.remove(); lasers1.splice(i, 1); }
        }

        meteoritos.forEach(id => {
            let met = document.getElementById(id);
            if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                let rM = met.getBoundingClientRect();
                if (rM.left > dim.limiteX + 10) { Game_Over_1("LOS METEORITOS ROMPIERON LA DEFENSA."); }
                else if (hitboxNave.left < rM.right && hitboxNave.right > rM.left && hitboxNave.top < rM.bottom && hitboxNave.bottom > rM.top) {
                    RecibirDano(rectNave); 
                }
            }
        });
    }
    loopJuego1 = setInterval(loopPrincipal1, 30); 

    document.getElementById("Pause").onclick = function() {
        if (nivel1Terminado) return; isPaused1 = !isPaused1;
        if (isPaused1) {
            document.getElementById("Pausa_Pantalla").style.display = "flex"; document.getElementById("Fondo_Ciberpunk").pause();
            meteoritos.forEach(id => { let el = document.getElementById(id); if(el) { let comp = window.getComputedStyle(el); el.style.left = comp.left; el.style.transition = "none"; } });
            arrayPowerUps.forEach(p => { if(p.element) { let comp = window.getComputedStyle(p.element); p.element.style.left = comp.left; p.element.style.transition = "none"; } });
        } else {
            document.getElementById("Pausa_Pantalla").style.display = "none"; document.getElementById("Fondo_Ciberpunk").play();
            meteoritos.forEach(id => { let el = document.getElementById(id); if(el && el.style.left !== "-500px" && el.style.left !== "-70%") { el.style.transition = "3.5s linear"; el.style.left = "80%"; } });
        }
    };

    function Aumentar_Puntos() {
        if (nivel1Terminado || isPaused1) return;
        Puntaje++; document.getElementById("Puntaje").innerHTML = Puntaje + "&nbsp;/&nbsp;" + metaLvl1;
        if (Puntaje >= metaLvl1) {
            nivel1Terminado = true; keys1 = {}; document.getElementById("Fondo_Ciberpunk").pause(); document.getElementById("Triunfo").play(); detenerMeteoritos();
            Swal.fire({
                title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff00ff; text-shadow: 0 0 10px #ff00ff; font-size: 22px;">¡AMENAZA NEUTRALIZADA!</span>',
                html: '<div style="font-family: sans-serif; color: #e0e0e0; font-size: 16px;">La primera oleada ha sido destruida.<br><b>Sistemas de la nave listos para evolucionar a Doble Láser.</b></div>',
                imageUrl: 'IMG/Check.png', imageWidth: 100, background: 'rgba(0, 5, 15, 0.95)', color: '#fff',
                confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">INICIAR FASE 2</span>', confirmButtonColor: '#ff00ff', customClass: { popup: 'alerta-neon-lvl2' }, allowOutsideClick: false
            }).then(() => {
                document.getElementById("NIVEL_01").style.display = "none"; document.getElementById("NIVEL_02").style.display = "flex";
                if(typeof PLAYlvl2 === "function") PLAYlvl2(); 
            });
        }
    }

    function Game_Over_1(razon) {
        if(nivel1Terminado) return; nivel1Terminado = true; keys1 = {}; detenerMeteoritos();
        Swal.fire({
            title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff3300; font-size: 24px;">¡MISIÓN FALLIDA!</span>',
            html: '<b style="color:white; font-size: 16px;">' + razon + '</b><br><br>La Tierra ha sufrido daños críticos.',
            icon: 'error', background: 'rgba(15, 0, 0, 0.95)', color: '#fff', confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">REINTENTAR NIVEL 1</span>', confirmButtonColor: '#ff3300', allowOutsideClick: false
        }).then(() => { Tiempo = 71; Puntaje = 0; document.getElementById("Tiempo").innerHTML = 70; document.getElementById("Puntaje").innerHTML = "0&nbsp;/&nbsp;" + metaLvl1; JUEGO(); });
    }

    function detenerMeteoritos() {
        spawnIntervals1.forEach(clearInterval); spawnIntervals1 = [];
        spawnTimeouts1.forEach(clearTimeout); spawnTimeouts1 = [];
        clearInterval(Restar_Tiempo); clearInterval(loopJuego1);
        meteoritos.forEach(id => { let el = document.getElementById(id); if(el) { el.style.transition = "0s"; el.style.left = "-70%"; } });
        lasers1.forEach(l => { if (l && l.element) l.element.remove(); }); lasers1 = [];
        arrayPowerUps.forEach(p => { if(p.element) p.element.remove(); }); arrayPowerUps = [];
    }

    function iniciarTrayectoria(id, velocidad) {
        if (nivel1Terminado || isPaused1) return;
        let el = document.getElementById(id);
        if(el) { let dim = getDimensiones1(); let altura = Math.round(Math.random() * dim.alturaMax); el.style.left = "80%"; el.style.top = altura + "px"; el.style.transition = velocidad + "s linear"; }
    }

    configOleada1.forEach(m => {
        spawnTimeouts1.push(setTimeout(() => iniciarTrayectoria(m.id, m.vel), m.delay));
        spawnIntervals1.push(setInterval(() => iniciarTrayectoria(m.id, m.vel), m.freq));
    });

    function Explulsar(id) {
        const sonidos = ["Puntos_sound", "Punto2", "Punto3", "Punto4"];
        let randomSound = sonidos[Math.floor(Math.random() * sonidos.length)];
        let sound = document.getElementById(randomSound);
        if(sound) { sound.currentTime = 0; let p = sound.play(); if (p !== undefined) p.catch(()=>{}); }
        let el = document.getElementById(id); let dim = getDimensiones1(); let altura = Math.round(Math.random() * dim.alturaMax);
        el.style.left = "-500px"; el.style.top = altura + "px"; el.style.transition = "1.8s";
    }
}

document.getElementById("Play").addEventListener('click', PLAY);
function PLAY() {
    if (juegoIniciadoLvl1) return; juegoIniciadoLvl1 = true; let Conteo = 4;
    var mf = document.getElementById("Fondo_Ciberpunk"); mf.volume = 0.02; mf.play();
    document.getElementById("Texo").style.display = "none"; document.querySelector("#Start .Dificultad_Flex").style.display = "none"; document.getElementById("Play").style.display = "none";
    setTimeout(JUEGO, 4100);
    let cuentaRegresiva = setInterval(() => {
        Conteo--; document.getElementById("RGB").innerHTML = Conteo;
        if (Conteo === -1) { clearInterval(cuentaRegresiva); document.getElementById("Contenedor_contador").style.display = "none"; document.getElementById("Start").style.display = "none"; }
    }, 1000);
}

function aplicarTransicionCinematica(idOc, idMo) {
    let eO = document.getElementById(idOc); let eM = document.getElementById(idMo);
    eO.style.transform = "scale(1.5) translateZ(100px)"; eO.style.opacity = "0"; eO.style.filter = "blur(20px)"; eO.style.transition = "all 0.8s ease";
    setTimeout(() => { eO.style.display = "none"; eO.style.transform = "none"; eO.style.filter = "none"; eM.style.display = "flex"; void eM.offsetWidth; eM.style.opacity = "1"; }, 800);
}
function Mover() { aplicarTransicionCinematica("Seccion_01", "Reglas"); }
function Mover_2() { aplicarTransicionCinematica("Reglas", "Seccion_2"); }
function Mover_3() { document.getElementById("narracion").pause(); aplicarTransicionCinematica("Seccion_2", "Seccion_Juego"); }
function Reloj_Tiempo() {
    let F = new Date(); let H = F.getHours(); let ampm = H >= 12 ? 'PM' : 'AM'; H = H % 12; H = H ? H : 12;
    document.getElementById("Dia_Semana").textContent = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][F.getDay()];
    document.getElementById("dia").textContent = F.getDate(); document.getElementById("mes").textContent = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][F.getMonth()];
    document.getElementById("año").textContent = F.getFullYear(); document.getElementById("Hora").textContent = H < 10 ? "0" + H : H;
    document.getElementById("Minutos").textContent = F.getMinutes() < 10 ? "0" + F.getMinutes() : F.getMinutes(); document.getElementById("Segundos").textContent = F.getSeconds() < 10 ? "0" + F.getSeconds() : F.getSeconds();
    document.getElementById("AMPM").textContent = ampm;
}
setInterval(Reloj_Tiempo, 1000); Reloj_Tiempo();