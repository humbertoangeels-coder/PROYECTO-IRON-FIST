let Tiempolvl2 = 61; let Puntajelvl2 = 0; const metaPuntosLvl2 = 25; // NUEVA META DE 25 PUNTOS
let nivel2Terminado = false; let isPaused2 = false; let juegoIniciadoLvl2 = false;
let VidasLvl2 = 3;

let keys2 = {};
document.addEventListener('keydown', (e) => {
    if (e.key === " ") e.preventDefault();
    if (!nivel2Terminado && !isPaused2 && document.getElementById("NIVEL_02").style.display !== "none") {
        keys2[e.key.toLowerCase()] = true;
    }
});
document.addEventListener('keyup', (e) => { keys2[e.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { keys2 = {}; });

function crearTextoPunto2(x, y, contenedor, color) {
    let txt = document.createElement('div'); txt.innerText = "+1"; txt.className = "PuntoFlotante";
    txt.style.color = color; txt.style.textShadow = "0 0 10px " + color;
    let rectCont = contenedor.getBoundingClientRect();
    txt.style.left = (x - rectCont.left) + 'px'; txt.style.top = (y - rectCont.top) + 'px';
    contenedor.appendChild(txt); setTimeout(() => txt.remove(), 600);
}

let Restar_Tiempolvl2, loopJuego2;
let spawnTimeouts2 = []; let spawnIntervals2 = [];

const meteoritos2 = ['Meteioritolvl2', 'Meteiorito2lvl2', 'Meteiorito3lvl2', 'Meteiorito4lvl2', 'Meteiorito5lvl2', 'Meteiorito6lvl2'];
const configOleada2 = [
    { id: 'Meteioritolvl2', delay: 2000, freq: 3100, vel: 3.0 },
    { id: 'Meteiorito2lvl2', delay: 2500, freq: 3200, vel: 3.0 },
    { id: 'Meteiorito3lvl2', delay: 3000, freq: 3050, vel: 3.0 },
    { id: 'Meteiorito4lvl2', delay: 3500, freq: 2900, vel: 3.0 },
    { id: 'Meteiorito5lvl2', delay: 4200, freq: 3300, vel: 3.0 },
    { id: 'Meteiorito6lvl2', delay: 4800, freq: 3150, vel: 3.0 }
];

function getDimensiones2() { return { limiteX: document.querySelector('.Contenedorlvl2').offsetWidth * 0.70, alturaMax: document.querySelector('.Contenedorlvl2').offsetHeight - 70 }; }

function crearExplosion2(x, y, contenedor) {
    let exp = document.createElement('div'); exp.classList.add('Explosion');
    let rectCont = contenedor.getBoundingClientRect();
    exp.style.left = (x - rectCont.left - 10) + 'px'; exp.style.top = (y - rectCont.top - 10) + 'px';
    contenedor.appendChild(exp); setTimeout(() => exp.remove(), 400);
}

function JUEGOlvl2() {
    nivel2Terminado = false; isPaused2 = false; keys2 = {};

    let tablero = document.querySelector('.Contenedorlvl2');
    let nave2 = document.getElementById("NaveJugador2"); nave2.style.opacity = "1";

    VidasLvl2 = 3;
    document.getElementById("corazon1_lvl2").classList.remove("perdida");
    document.getElementById("corazon2_lvl2").classList.remove("perdida");
    document.getElementById("corazon3_lvl2").classList.remove("perdida");

    let esInvulnerable = true; nave2.classList.add("NaveInvulnerable");
    setTimeout(() => { esInvulnerable = false; nave2.classList.remove("NaveInvulnerable"); }, 2500);

    let posX2 = tablero.offsetWidth * 0.55; let posY2 = tablero.offsetHeight / 2;
    const velocidadNave2 = 12;
    let lasers2 = []; let puedeDisparar2 = true;

    Restar_Tiempolvl2 = setInterval(() => {
        if (nivel2Terminado || isPaused2) return;
        Tiempolvl2--; document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2;
        if (Tiempolvl2 <= 0) { Game_Over_2("EL TIEMPO SE AGOTÓ."); }
    }, 1000);

    function dispararLaser2() {
        puedeDisparar2 = false;
        let laserY1 = posY2 + (nave2.offsetHeight / 2) - 15; let laserY2 = posY2 + (nave2.offsetHeight / 2) + 10; let laserX = posX2 - 10;
        let l1 = document.createElement("div"); l1.classList.add("Laser2"); l1.style.left = laserX + "px"; l1.style.top = laserY1 + "px"; tablero.appendChild(l1); lasers2.push({ element: l1, x: laserX, y: laserY1 });
        let l2 = document.createElement("div"); l2.classList.add("Laser2"); l2.style.left = laserX + "px"; l2.style.top = laserY2 + "px"; tablero.appendChild(l2); lasers2.push({ element: l2, x: laserX, y: laserY2 });
        setTimeout(() => puedeDisparar2 = true, 200);
    }

    function RecibirDano2(rectNave) {
        if (esInvulnerable) return;
        VidasLvl2--;
        crearExplosion2(rectNave.left, rectNave.top, tablero);
        let s = document.getElementById("Perdiste_sound"); if (s) { s.currentTime = 0; s.play().catch(() => { }); }
        tablero.classList.add("PantallaDano"); setTimeout(() => tablero.classList.remove("PantallaDano"), 300);

        let corazon = document.getElementById("corazon" + (VidasLvl2 + 1) + "_lvl2");
        if (corazon) corazon.classList.add("perdida");

        if (VidasLvl2 <= 0) { Game_Over_2("TU NAVE FUE DESTRUIDA."); }
        else {
            esInvulnerable = true; nave2.classList.add("NaveInvulnerable");
            setTimeout(() => { esInvulnerable = false; nave2.classList.remove("NaveInvulnerable"); }, 2000);
        }
    }

    function loopPrincipal2() {
        if (nivel2Terminado || isPaused2) return;

        let velActual = keys2['shift'] ? velocidadNave2 * 1.8 : velocidadNave2;
        if (keys2['shift']) { nave2.classList.add("NaveBoost"); } else { nave2.classList.remove("NaveBoost"); }

        let dx = 0; let dy = 0;
        if (keys2['w'] || keys2['arrowup']) dy -= velActual;
        if (keys2['s'] || keys2['arrowdown']) dy += velActual;
        if (keys2['a'] || keys2['arrowleft']) dx -= velActual;
        if (keys2['d'] || keys2['arrowright']) dx += velActual;

        posX2 += dx; posY2 += dy;

        let dim = getDimensiones2();
        if (posX2 < 0) posX2 = 0; if (posY2 < 0) posY2 = 0; if (posY2 > dim.alturaMax) posY2 = dim.alturaMax;
        nave2.style.left = posX2 + "px"; nave2.style.top = posY2 + "px";

        if (keys2[' '] && puedeDisparar2) { dispararLaser2(); }

        let rectNave = nave2.getBoundingClientRect();
        let hitboxNave = { left: rectNave.left + 25, right: rectNave.right - 25, top: rectNave.top + 25, bottom: rectNave.bottom - 25 };

        for (let i = lasers2.length - 1; i >= 0; i--) {
            let l = lasers2[i];
            if (!l || !l.element || typeof l.x === 'undefined') { lasers2.splice(i, 1); continue; }

            l.x -= 30; l.element.style.left = l.x + "px";
            let rectLaser = l.element.getBoundingClientRect(); let laserGolpeo = false;

            meteoritos2.forEach(id => {
                let met = document.getElementById(id);
                if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                    let rM = met.getBoundingClientRect();
                    if (rectLaser.left < rM.right && rectLaser.right > rM.left && rectLaser.top < rM.bottom && rectLaser.bottom > rM.top) {
                        crearExplosion2(rM.left, rM.top, tablero); crearTextoPunto2(rM.left, rM.top, tablero, "#ff00ff");
                        Explulsarlvl2(id); Aumentar_Puntoslvl2(); laserGolpeo = true;
                    }
                }
            });
            if (laserGolpeo || l.x < -100) { l.element.remove(); lasers2.splice(i, 1); }
        }

        meteoritos2.forEach(id => {
            let met = document.getElementById(id);
            if (met && met.style.left !== "-500px" && met.style.left !== "-70%") {
                let rM = met.getBoundingClientRect();
                if (rM.left > dim.limiteX + 10) { Game_Over_2("EL ENEMIGO SUPERÓ TU POSICIÓN."); }
                else if (hitboxNave.left < rM.right && hitboxNave.right > rM.left && hitboxNave.top < rM.bottom && hitboxNave.bottom > rM.top) {
                    RecibirDano2(rectNave);
                }
            }
        });
    }
    loopJuego2 = setInterval(loopPrincipal2, 30);

    document.getElementById("Pauselvl2").onclick = function () {
        if (nivel2Terminado) return; isPaused2 = !isPaused2;
        if (isPaused2) {
            document.getElementById("Pausa_Pantallalvl2").style.display = "flex"; document.getElementById("Fondo_Ciberpunk").pause();
            meteoritos2.forEach(id => { let el = document.getElementById(id); if (el) { let comp = window.getComputedStyle(el); el.style.left = comp.left; el.style.transition = "none"; } });
        } else {
            document.getElementById("Pausa_Pantallalvl2").style.display = "none"; document.getElementById("Fondo_Ciberpunk").play();
            meteoritos2.forEach(id => { let el = document.getElementById(id); if (el && el.style.left !== "-500px" && el.style.left !== "-70%") { el.style.transition = "3s linear"; el.style.left = "80%"; } });
        }
    };

    function Aumentar_Puntoslvl2() {
        if (nivel2Terminado || isPaused2) return;
        Puntajelvl2++; document.getElementById("Puntajelvl2").innerHTML = Puntajelvl2 + " / " + metaPuntosLvl2;
        if (Puntajelvl2 >= metaPuntosLvl2) {
            nivel2Terminado = true; keys2 = {}; document.getElementById("Fondo_Ciberpunk").pause(); document.getElementById("Triunfo").play(); detenerMeteoritosLvl2();
            Swal.fire({
                title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff3300; font-size: 22px;">¡NIVEL SUPERADO!</span>',
                html: '<div style="color: #e0e0e0; font-family: sans-serif;">Prepárate para la oleada final. Tu nave recibirá un escudo de armas avanzado.</div>',
                imageUrl: 'IMG/Check.png', imageWidth: 100, background: 'rgba(15, 0, 15, 0.95)', color: '#fff',
                confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">ENTRAR FASE 3</span>', confirmButtonColor: '#ff3300', customClass: { popup: 'alerta-neon-lvl3' }, allowOutsideClick: false
            }).then(() => {
                document.getElementById("NIVEL_02").style.display = "none"; document.getElementById("NIVEL3").style.display = "flex";
                if (typeof PLAYlvl3 === "function") PLAYlvl3();
            });
        }
    }

    function Game_Over_2(razon) {
        if (nivel2Terminado) return; nivel2Terminado = true; keys2 = {}; detenerMeteoritosLvl2();
        Swal.fire({
            title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff00ff; font-size: 24px;">¡CAÍSTE EN COMBATE!</span>',
            html: '<b style="color:white; font-size: 16px;">' + razon + '</b>',
            icon: 'error', background: 'rgba(15, 0, 15, 0.95)', color: '#fff', confirmButtonText: 'REINTENTAR FASE 2', confirmButtonColor: '#ff00ff', allowOutsideClick: false
        }).then(() => { Tiempolvl2 = 61; Puntajelvl2 = 0; document.getElementById("Tiempolvl2").innerHTML = 60; document.getElementById("Puntajelvl2").innerHTML = "0 / " + metaPuntosLvl2; JUEGOlvl2(); });
    }

    function detenerMeteoritosLvl2() {
        spawnIntervals2.forEach(clearInterval); spawnIntervals2 = [];
        spawnTimeouts2.forEach(clearTimeout); spawnTimeouts2 = [];
        clearInterval(Restar_Tiempolvl2); clearInterval(loopJuego2);
        meteoritos2.forEach(id => { let el = document.getElementById(id); if (el) { el.style.transition = "0s"; el.style.left = "-70%"; } });
        lasers2.forEach(l => { if (l && l.element) l.element.remove(); }); lasers2 = [];
    }

    function iniciarTrayectoriaLvl2(id, velocidad) {
        if (nivel2Terminado || isPaused2) return;
        let el = document.getElementById(id);
        if (el) { let dim = getDimensiones2(); let altura = Math.round(Math.random() * dim.alturaMax); el.style.left = "80%"; el.style.top = altura + "px"; el.style.transition = velocidad + "s linear"; }
    }

    configOleada2.forEach(m => {
        spawnTimeouts2.push(setTimeout(() => iniciarTrayectoriaLvl2(m.id, m.vel), m.delay));
        spawnIntervals2.push(setInterval(() => iniciarTrayectoriaLvl2(m.id, m.vel), m.freq));
    });

    function Explulsarlvl2(id) {
        const sonidos = ["Puntos_sound", "Punto2", "Punto3", "Punto4"];
        let randomSound = sonidos[Math.floor(Math.random() * sonidos.length)];
        let sound = document.getElementById(randomSound);
        if (sound) { sound.currentTime = 0; let p = sound.play(); if (p !== undefined) p.catch(() => { }); }
        let el = document.getElementById(id); let dim = getDimensiones2(); let altura = Math.round(Math.random() * dim.alturaMax);
        el.style.left = "-500px"; el.style.top = altura + "px"; el.style.transition = "1.8s";
    }
}

function PLAYlvl2() {
    if (juegoIniciadoLvl2) return; juegoIniciadoLvl2 = true; let Conteo = 4;
    document.getElementById("Fondo_Ciberpunk").play();
    document.querySelector("#NIVEL_02 .Contenedor_Mensaje_Star").style.display = "none";
    setTimeout(JUEGOlvl2, 4100);
    let cuentaRegresiva = setInterval(() => {
        Conteo--; document.getElementById("RGBlvl2").innerHTML = Conteo;
        if (Conteo === -1) { clearInterval(cuentaRegresiva); document.getElementById("Contenedor_contadorlvl2").style.display = "none"; document.getElementById("Startlvl2").style.display = "none"; }
    }, 1000);
}