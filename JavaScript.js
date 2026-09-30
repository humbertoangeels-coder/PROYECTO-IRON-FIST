Swal.fire({
    title: '<span style="font-family: \'Press Start 2P\', cursive; color: #00d2ff; text-shadow: 0 0 10px #00d2ff; font-size: 18px; line-height: 1.5;">¿PREPARADO PARA SALVAR EL MUNDO?</span>',
    html: '<div style="font-family: sans-serif; color: #e0e0e0; font-size: 14px; line-height: 1.6; padding: 10px;">IRON FIST es un juego que mejorará tus reflejos a medida que pases de nivel, retándote cada vez más a medida que avances y desbloqueando grandes logros al final de cada nivel. Esperamos te diviertas y disfrutes de este gran juego.</div>',
    imageUrl: 'IMG/planeta_tierra.png',
    imageWidth: 120,
    imageAlt: 'Planeta Tierra',
    background: 'rgba(0, 5, 15, 0.95)', color: '#fff', backdrop: 'rgba(0, 210, 255, 0.15)',
    confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">ESTOY PREPARADO</span>',
    confirmButtonColor: '#00d2ff', width: '50%', padding: '2em', allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false, stopKeydownPropagation: false, customClass: { popup: 'alerta-neon-intro' }
});

let Tiempo = 71;
let Puntaje = 0;
const metaLvl1 = 10; 
let nivel1Terminado = false;
let isPaused1 = false;
let juegoIniciadoLvl1 = false;

let Narracion = 1;
document.getElementById("Contenedor_narracion").addEventListener('click', Iniciar_narracion);
function Iniciar_narracion() {
    if (Narracion === 1) {
        document.getElementById("narracion").play();
        document.getElementById("VOLUMEN").style.display = "none";
        document.getElementById("PAUSE").style.display = "table";
        Narracion = 2;
    } else {
        document.getElementById("narracion").pause();
        document.getElementById("VOLUMEN").style.display = "table";
        document.getElementById("PAUSE").style.display = "none";
        Narracion = 1;
    }
}

let Graficos = 1;
function Graficos_fondo() {
    if (Graficos === 1) {
        document.getElementById("Recursos").style.marginLeft = "60%";
        document.getElementById("Fondo").style.background = "url(IMG/Fondo_Espacio2.jpg)";
        document.getElementById("Fondo").style.backgroundAttachment = "fixed";
        document.getElementById("Fondo").style.backgroundRepeat = "no-repeat";
        document.getElementById("Fondo").style.backgroundSize = "cover";
        Graficos = 2;
    } else {
        document.getElementById("Recursos").style.marginLeft = "0%";
        document.getElementById("Fondo").style.backgroundImage = "url(IMG/Fondo_Espacio.gif)";
        Graficos = 1;
    }
}

let Restar_Tiempo, Reanudar_trayectoria, Reanudar_trayectoria2;
let Activador_inicial, Activador_inicial2, perdisteLoop; 

function getDimensiones1() {
    const tablero = document.querySelector('.Contenedor');
    return { limiteX: tablero.offsetWidth * 0.70, alturaMax: tablero.offsetHeight - 70 };
}

function JUEGO() {
    nivel1Terminado = false;
    isPaused1 = false;

    function Tiempo_Disminur() {
        if (nivel1Terminado || isPaused1) return;
        Tiempo--;
        document.getElementById("Tiempo").innerHTML = Tiempo;
        if (Tiempo <= 0) {
            document.getElementById("Perdiste_sound").play();
            alert("El tiempo se ha agotado. Misión Fallida.");
            reiniciarEstado();
        }
    }
    Restar_Tiempo = setInterval(Tiempo_Disminur, 1000);

    const meteoritos = ['Meteiorito', 'Meteiorito2'];
    meteoritos.forEach(id => {
        let el = document.getElementById(id);
        let newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        newEl.addEventListener('mouseover', Aumentar_Puntos);
        newEl.addEventListener('mouseover', () => Explulsar(newEl.id));
    });

    function Aumentar_Puntos() {
        if (nivel1Terminado || isPaused1) return;
        Puntaje++;
        document.getElementById("Puntaje").innerHTML = Puntaje + "&nbsp;/&nbsp;" + metaLvl1;
        if (Puntaje >= metaLvl1) {
            terminarJuego();
        }
    }

    function terminarJuego() {
        nivel1Terminado = true;
        document.getElementById("Tiempo").innerHTML = 70;
        document.getElementById("Puntaje").innerHTML = "0&nbsp;/&nbsp;" + metaLvl1;
        document.getElementById("Fondo_Ciberpunk").pause();
        document.getElementById("Triunfo").play();

        document.getElementById("NEXT").addEventListener('click', () => {
            document.getElementById("NIVEL_01").style.display = "none";
            document.getElementById("NIVEL_02").style.display = "flex";
        });
        
        detenerMeteoritos();

        Swal.fire({
            title: '<span style="font-family: \'Press Start 2P\', cursive; color: #ff00ff; text-shadow: 0 0 10px #ff00ff; font-size: 22px; line-height: 1.5;">¡AMENAZA NEUTRALIZADA!</span>',
            html: '<div style="font-family: sans-serif; color: #e0e0e0; font-size: 16px; line-height: 1.6; padding: 10px;"><p>La primera oleada ha sido destruida, pero la verdadera prueba apenas comienza.</p><p><strong style="color: #00ffcc; text-shadow: 0 0 8px #00ffcc; font-size: 18px;">¡Excelente trabajo, Comandante!</strong></p><p>Recarga tus escudos y prepárate. El <b>Nivel 2</b> no tendrá piedad.</p></div>',
            imageUrl: 'IMG/Check.png', imageWidth: 100, imageAlt: 'Misión Cumplida',
            background: 'rgba(0, 5, 15, 0.95)', color: '#fff', backdrop: 'rgba(255, 0, 255, 0.2)', 
            confirmButtonText: '<span style="font-family: \'Press Start 2P\', cursive; font-size: 12px;">INICIAR FASE 2</span>',
            confirmButtonColor: '#ff00ff', width: '50%', padding: '2em', allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false, stopKeydownPropagation: false, customClass: { popup: 'alerta-neon-lvl1' }
        });

        Puntaje = 0; Tiempo = 71;
    }

    function detenerMeteoritos() {
        clearInterval(Reanudar_trayectoria); clearInterval(Reanudar_trayectoria2);
        clearInterval(Restar_Tiempo); clearInterval(perdisteLoop);
        clearTimeout(Activador_inicial); clearTimeout(Activador_inicial2);

        meteoritos.forEach(id => {
            let el = document.getElementById(id);
            if(el) { el.style.left = "-70%"; el.style.transition = "0s"; }
        });
    }

    function iniciarTrayectoria(id, distancia, velocidad) {
        let el = document.getElementById(id);
        if(el) {
            let dim = getDimensiones1();
            let altura = Math.round(Math.random() * dim.alturaMax);
            el.style.left = distancia + "%";
            el.style.top = altura + "px";
            el.style.transition = velocidad + "s";
        }
    }

    Activador_inicial = setTimeout(() => iniciarTrayectoria('Meteiorito', 80, 2.4), 2000);
    Reanudar_trayectoria = setInterval(() => iniciarTrayectoria('Meteiorito', 80, 2.4), 2430);

    Activador_inicial2 = setTimeout(() => iniciarTrayectoria('Meteiorito2', 80, 2.4), 2600);
    Reanudar_trayectoria2 = setInterval(() => iniciarTrayectoria('Meteiorito2', 80, 2.4), 2350);

    function Explulsar(id) {
        let sound = (id === 'Meteiorito') ? document.getElementById("Puntos_sound") : document.getElementById("Punto2");
        if(sound) { sound.currentTime = 0; sound.play(); }
        let el = document.getElementById(id);
        let dim = getDimensiones1();
        let altura = Math.round(Math.random() * dim.alturaMax);
        el.style.left = "-500px";
        el.style.top = altura + "px";
        el.style.transition = "1.8s";
    }

    function checkPerdiste() {
        if (nivel1Terminado || isPaused1) return;
        let m1 = document.getElementById("Meteiorito");
        let m2 = document.getElementById("Meteiorito2");
        let dim = getDimensiones1();

        if ((m1 && m1.offsetLeft > dim.limiteX) || (m2 && m2.offsetLeft > dim.limiteX)) {
            nivel1Terminado = true; 
            document.getElementById("Perdiste_sound").play();
            alert("YA ES DEMASIADO TARDE, LOS METEORITOS DESTRUYERON GRAN PARTE DEL CONTINENTE Y LO MEJOR ES ESPERAR LO PEOR");
            reiniciarEstado();
        }
    }
    perdisteLoop = setInterval(checkPerdiste, 20);

    function reiniciarEstado() {
        detenerMeteoritos();
        Tiempo = 71; Puntaje = 0;
        document.getElementById("Tiempo").innerHTML = 70;
        document.getElementById("Puntaje").innerHTML = "0&nbsp;/&nbsp;" + metaLvl1;
        nivel1Terminado = false; 

        Activador_inicial = setTimeout(() => iniciarTrayectoria('Meteiorito', 80, 2.4), 2000);
        Reanudar_trayectoria = setInterval(() => iniciarTrayectoria('Meteiorito', 80, 2.4), 2430);

        Activador_inicial2 = setTimeout(() => iniciarTrayectoria('Meteiorito2', 80, 2.4), 2600);
        Reanudar_trayectoria2 = setInterval(() => iniciarTrayectoria('Meteiorito2', 80, 2.4), 2350);

        Restar_Tiempo = setInterval(Tiempo_Disminur, 1000);
        perdisteLoop = setInterval(checkPerdiste, 20);
    }
}

document.getElementById("Play").addEventListener('click', PLAY);

function PLAY() {
    if (juegoIniciadoLvl1) return;
    juegoIniciadoLvl1 = true;
    let Conteo = 4;
    
    var musicaFondo = document.getElementById("Fondo_Ciberpunk");
    musicaFondo.volume = 0.02; 
    musicaFondo.play();

    document.getElementById("Texo").style.left = "-900px";
    document.getElementById("Contenedor_Mensaje_Star").style.opacity = "0";

    setTimeout(JUEGO, 4100);

    function ESPERAR() {
        let cuentaRegresiva = setInterval(() => {
            Conteo--;
            document.getElementById("RGB").innerHTML = Conteo;
            if (Conteo === -1) {
                clearInterval(cuentaRegresiva);
                document.getElementById("Contenedor_contador").style.display = "none";
                document.getElementById("Start").style.display = "none";
                DETENER_JUEGO();
            }
        }, 1000);
    }
    setTimeout(ESPERAR, 350);
}

function DETENER_JUEGO() {
    document.getElementById("Pause").addEventListener('click', () => {
        if (nivel1Terminado) return;
        const meteoritos = ['Meteiorito', 'Meteiorito2'];
        isPaused1 = !isPaused1;

        if (isPaused1) {
            document.getElementById("Pausa_Pantalla").style.display = "flex";
            document.getElementById("Fondo_Ciberpunk").pause();
            
            clearInterval(Restar_Tiempo);
            clearInterval(Reanudar_trayectoria);
            clearInterval(Reanudar_trayectoria2);
            clearTimeout(Activador_inicial);
            clearTimeout(Activador_inicial2);

            meteoritos.forEach(id => {
                let el = document.getElementById(id);
                if(el) {
                    let comp = window.getComputedStyle(el);
                    el.style.transition = "none";
                    el.style.left = comp.left;
                    el.style.top = comp.top;
                }
            });
        } else {
            document.getElementById("Pausa_Pantalla").style.display = "none";
            document.getElementById("Fondo_Ciberpunk").play();
            
            Restar_Tiempo = setInterval(() => {
                if (nivel1Terminado || isPaused1) return;
                Tiempo--;
                document.getElementById("Tiempo").innerHTML = Tiempo;
                if (Tiempo <= 0) {
                    document.getElementById("Perdiste_sound").play();
                    alert("Lo lamento perdiste");
                }
            }, 1000);

            Reanudar_trayectoria = setInterval(() => {
                let el = document.getElementById('Meteiorito');
                if(el) { el.style.transition = "2.4s"; el.style.left = "80%"; }
            }, 2430);
            
            Reanudar_trayectoria2 = setInterval(() => {
                let el = document.getElementById('Meteiorito2');
                if(el) { el.style.transition = "2.4s"; el.style.left = "80%"; }
            }, 2350);

            meteoritos.forEach(id => {
                let el = document.getElementById(id);
                if(el) { el.style.transition = "2.4s"; el.style.left = "80%"; }
            });
        }
    });
}

function aplicarTransicionCinematica(elemento) {
    elemento.style.transform = "scale(1.5) translateZ(100px)"; 
    elemento.style.opacity = "0"; 
    elemento.style.filter = "blur(20px)"; 
    elemento.style.transition = "all 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53)"; 
}

function Mover() {
    var contenedor = document.getElementById("Seccion_01");
    aplicarTransicionCinematica(contenedor);
    
    setTimeout(() => {
        document.getElementById("Reglas").style.top = "0%";
        contenedor.style.display = "none";
    }, 800);
}

function Mover_2() {
    var Reglas_Sacar = document.getElementById("Reglas");
    aplicarTransicionCinematica(Reglas_Sacar);
    
    setTimeout(() => {
        Reglas_Sacar.style.display = "none";
        
        let historiaPanel = document.querySelector(".Contenedor_Historia");
        let videoPanel = document.querySelector(".Contenedor_Video_Holograma");
        
        if (window.innerWidth > 950) {
            historiaPanel.style.transform = "translateX(0)";
            historiaPanel.style.opacity = "1";
            videoPanel.style.transform = "translateX(0)";
            videoPanel.style.opacity = "1";
        }
    }, 800);
}

function Mover_3() {
    var contenedor_2 = document.getElementById("Seccion_2");
    document.getElementById("narracion").pause();
    aplicarTransicionCinematica(contenedor_2);

    setTimeout(() => {
        document.getElementById("Seccion_Juego").style.left = "0%";
        contenedor_2.style.display = "none";
    }, 800);
}

function Reloj_Tiempo() {
    let Fecha = new Date();
    let Horas = Fecha.getHours();
    let ampm = Horas >= 12 ? 'PM' : 'AM';
    Horas = Horas % 12;
    Horas = Horas ? Horas : 12;

    document.getElementById("Dia_Semana").textContent = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][Fecha.getDay()];
    document.getElementById("dia").textContent = Fecha.getDate();
    document.getElementById("mes").textContent = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][Fecha.getMonth()];
    document.getElementById("año").textContent = Fecha.getFullYear();

    document.getElementById("Hora").textContent = Horas < 10 ? "0" + Horas : Horas;
    document.getElementById("Minutos").textContent = Fecha.getMinutes() < 10 ? "0" + Fecha.getMinutes() : Fecha.getMinutes();
    document.getElementById("Segundos").textContent = Fecha.getSeconds() < 10 ? "0" + Fecha.getSeconds() : Fecha.getSeconds();
    document.getElementById("AMPM").textContent = ampm;
}
setInterval(Reloj_Tiempo, 1000);
Reloj_Tiempo();