let Tiempolvl3 = 50;
let Puntajelvl3 = 0;
const metaPuntosLvl3 = 20; 
let nivel3Terminado = false;
let isPaused3 = false;
let juegoIniciadoLvl3 = false;

let Intervalo_Dirlvl3, Intervalo_Dir2lvl3, Intervalo_Dir3lvl3, Intervalo_Dir4lvl3, Restar_Tiempolvl3;
let perdisteLooplvl3;
let Arranque_1, Arranque_2, Arranque_3, Arranque_4;

function getDimensiones3() {
    const tablero = document.querySelector('.Contenedorlvl3');
    return { limiteX: tablero.offsetWidth * 0.70, alturaMax: tablero.offsetHeight - 70 };
}

function JUEGOlvl3() {
    nivel3Terminado = false;
    isPaused3 = false;

    // ESCONDER BOTON DE SIGUIENTE NIVEL YA QUE ES EL ÚLTIMO
    document.getElementById("NEXT").style.display = "none";
    document.getElementById("Siguiente_Texto_H2").innerText = "¡NIVEL FINAL!";
    document.getElementById("Siguiente_Texto_P").innerText = "Sobrevive a esta última oleada para salvar a la humanidad. Demuestra todo lo que has aprendido.";

    function Tiempo_Disminurlvl3() { 
        if (nivel3Terminado || isPaused3) return;
        Tiempolvl3--;
        let relojDom = document.getElementById("Tiempolvl3");
        relojDom.innerHTML = Tiempolvl3;
        
        if (Tiempolvl3 <= 10) relojDom.classList.add("Frenesi");
        else relojDom.classList.remove("Frenesi");

        if (Tiempolvl3 <= 0) {
            document.getElementById("Perdiste_sound").play();
            alert("EL TIEMPO SE AGOTÓ. LA TIERRA HA SIDO DESTRUIDA.");
            reiniciarEstadoLvl3();
        }
    }
    Restar_Tiempolvl3 = setInterval(Tiempo_Disminurlvl3, 1000);

    const meteoritos = ['Meteoritolvl3', 'Meteorito2lvl3', 'Meteorito3lvl3', 'Meteorito4lvl3'];
    meteoritos.forEach(id => {
        let el = document.getElementById(id);
        let newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        newEl.addEventListener('mouseover', Aumentar_Puntoslvl3);
        newEl.addEventListener('mouseover', () => Explulsarlvl3(newEl.id));
    });

    function Aumentar_Puntoslvl3() {
        if (nivel3Terminado || isPaused3) return;
        Puntajelvl3++; 
        document.getElementById("Puntajelvl3").innerHTML = Puntajelvl3 + " / " + metaPuntosLvl3;
        
        if (Puntajelvl3 >= metaPuntosLvl3) { 
            terminarJuegoLvl3();
        }
    }

    function terminarJuegoLvl3() {
        nivel3Terminado = true; 
        Puntajelvl3 = 0;
        Tiempolvl3 = 50;
        
        setTimeout(() => {
            Swal.fire({
                title : '¡MISIÓN CUMPLIDA! <br> Grupo Omega<br><br><img src="IMG/Logo_Omega.png" width = "120px">',
                html: '<b style="color: cyan;">La humanidad está a salvo gracias a ti.<br><br> CONTACTOS:<br><br> humbertoangeels-coder@certus.edu.pe <br> jhonatan.palacios@certus.edu.pe <br> nathaly.valero@certus.edu.pe <br> christopher.benjamin@certus.edu.pe <br> alvaro.campos@certus.edu.pe </b>',
                icon: 'success', background: '#000', color: '#fff', confirmButtonText: 'ENTENDIDO',
                width: '50%', height: '80%', timer: 100000, timerProgressbar: true,
                allowOutsideClick: true, allowEscapeKey: false, allowEnterKey: false, stopKeydownPropagation: false,
                customClass: { popup: 'alerta-neon-intro' }
            });
        }, 15000);

        document.getElementById("Fondo_Ciberpunk").pause();
        document.getElementById("Triunfo").play();

        detenerMeteoritosLvl3();

        document.getElementById("Musica_Final").play();
        document.getElementById("Pantalla_Ovnislvl3").style.left = "7%";
        document.getElementById("Pantalla_Ovnislvl3").style.transition = "6s";
        document.getElementById("Pantalla_Nodrizalvl3").style.left = "10%";
        document.getElementById("Pantalla_Nodrizalvl3").style.transition = "5s";
        document.getElementById("Pantalla_Ovnis2lvl3").style.left = "7%";
        document.getElementById("Pantalla_Ovnis2lvl3").style.transition = "6s";

        setTimeout(() => {
            document.getElementById("Pantalla_creditoslvl3").style.background = "black";
            document.getElementById("Creditoslvl3").style.top = "-15%";
            document.getElementById("Creditoslvl3").style.transition = "10s";
            document.getElementById("Proximolvl3").style.bottom = "-34%";
            document.getElementById("Proximolvl3").style.transition = "15s";
        }, 5000);
    }

    function detenerMeteoritosLvl3() {
        clearInterval(Intervalo_Dirlvl3); clearInterval(Intervalo_Dir2lvl3);
        clearInterval(Intervalo_Dir3lvl3); clearInterval(Intervalo_Dir4lvl3);
        clearTimeout(Arranque_1); clearTimeout(Arranque_2);
        clearTimeout(Arranque_3); clearTimeout(Arranque_4);
        clearInterval(Restar_Tiempolvl3); clearInterval(perdisteLooplvl3);

        meteoritos.forEach(id => {
            let el = document.getElementById(id);
            if(el) { el.style.left = "-70%"; el.style.transition = "0s"; }
        });
    }

    function iniciarTrayectoriaLvl3(id, velocidad) {
        let el = document.getElementById(id);
        if(el){
            let dim = getDimensiones3();
            let altura = Math.round(Math.random() * dim.alturaMax);
            el.style.left = "80%";
            el.style.top = altura + "px";
            el.style.transition = velocidad + "s";
        }
    }

    Arranque_1 = setTimeout(() => iniciarTrayectoriaLvl3('Meteoritolvl3', 1.9), 2200);
    Intervalo_Dirlvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteoritolvl3', 1.9), 2950);

    Arranque_2 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito2lvl3', 1.9), 2660);
    Intervalo_Dir2lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito2lvl3', 1.9), 2750);

    Arranque_3 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito3lvl3', 1.9), 2900);
    Intervalo_Dir3lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito3lvl3', 1.9), 2550);

    Arranque_4 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito4lvl3', 1.9), 3100);
    Intervalo_Dir4lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito4lvl3', 1.9), 2150);

    function Explulsarlvl3(id) {
        let sound;
        if (id === 'Meteoritolvl3') sound = document.getElementById("Puntos_sound");
        else if (id === 'Meteorito2lvl3') sound = document.getElementById("Punto2");
        else if (id === 'Meteorito3lvl3') sound = document.getElementById("Punto3");
        else sound = document.getElementById("Punto4");

        if(sound) { sound.currentTime = 0; sound.play(); }
        let el = document.getElementById(id);
        let dim = getDimensiones3();
        let altura = Math.round(Math.random() * dim.alturaMax);
        el.style.left = "-500px";
        el.style.top = altura + "px";
        el.style.transition = "1.7s";
    }

    function checkPerdisteLvl3() {
        if (nivel3Terminado || isPaused3) return; // FIX DE PAUSA APLICADO
        let m1 = document.getElementById("Meteoritolvl3");
        let m2 = document.getElementById("Meteorito2lvl3");
        let m3 = document.getElementById("Meteorito3lvl3");
        let m4 = document.getElementById("Meteorito4lvl3");
        let dim = getDimensiones3();

        if ((m1 && m1.offsetLeft > dim.limiteX) || (m2 && m2.offsetLeft > dim.limiteX) || (m3 && m3.offsetLeft > dim.limiteX) || (m4 && m4.offsetLeft > dim.limiteX)) {
            nivel3Terminado = true;
            document.getElementById("Tablero_Juegolvl3").classList.add("shake-anim");
            setTimeout(() => document.getElementById("Tablero_Juegolvl3").classList.remove("shake-anim"), 500);

            document.getElementById("Perdiste_sound").play();
            alert("YA ES DEMASIADO TARDE LOS METEORITOS DESTRUYERON GRAN PARTE DEL CONTINENTE.");
            reiniciarEstadoLvl3();
        }
    }
    perdisteLooplvl3 = setInterval(checkPerdisteLvl3, 20);

    function reiniciarEstadoLvl3() {
        detenerMeteoritosLvl3();
        Tiempolvl3 = 50; Puntajelvl3 = 0;
        document.getElementById("Puntajelvl3").innerHTML = "0 / " + metaPuntosLvl3;
        document.getElementById("Tiempolvl3").classList.remove("Frenesi");
        nivel3Terminado = false;
        
        Arranque_1 = setTimeout(() => iniciarTrayectoriaLvl3('Meteoritolvl3', 1.9), 2000);
        Intervalo_Dirlvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteoritolvl3', 1.9), 2950);

        Arranque_2 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito2lvl3', 1.9), 2000);
        Intervalo_Dir2lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito2lvl3', 1.9), 2750);

        Arranque_3 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito3lvl3', 1.9), 2600);
        Intervalo_Dir3lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito3lvl3', 1.9), 2550);

        Arranque_4 = setTimeout(() => iniciarTrayectoriaLvl3('Meteorito4lvl3', 1.9), 2900);
        Intervalo_Dir4lvl3 = setInterval(() => iniciarTrayectoriaLvl3('Meteorito4lvl3', 1.9), 2150);

        Restar_Tiempolvl3 = setInterval(Tiempo_Disminurlvl3, 1000);
        perdisteLooplvl3 = setInterval(checkPerdisteLvl3, 20);
    }
}

document.getElementById("Playlvl3").addEventListener('click', PLAYlvl3);

function PLAYlvl3() {
    if (juegoIniciadoLvl3) return;
    juegoIniciadoLvl3 = true;
    let Conteolvl3 = 4;

    document.getElementById("Fondo_Ciberpunk").play();
    document.getElementById("Textolvl3").style.left = "-900px";
    document.getElementById("Playlvl3").style.display = "none";
    document.getElementById("Dificultadlvl3").style.opacity = "0";
    
    setTimeout(JUEGOlvl3, 4100);
    
    let cuentaRegresiva = setInterval(() => {
        Conteolvl3--;
        document.getElementById("RGBlvl3").innerHTML = Conteolvl3;
        if (Conteolvl3 === -1) {
            clearInterval(cuentaRegresiva);
            document.getElementById("Contenedor_contadorlvl3").style.display = "none";
            document.getElementById("Startlvl3").style.display = "none";
            DETENER_JUEGOlvl3();
        }
    }, 1000);
}

function DETENER_JUEGOlvl3() {
    document.getElementById("Pauselvl3").addEventListener('click', () => {
        if (nivel3Terminado) return;
        const meteoritos = ['Meteoritolvl3', 'Meteorito2lvl3', 'Meteorito3lvl3', 'Meteorito4lvl3'];
        isPaused3 = !isPaused3;

        if (isPaused3) {
            document.getElementById("Pausa_Pantallalvl3").style.display = "flex";
            document.getElementById("Fondo_Ciberpunk").pause();
            
            clearInterval(Restar_Tiempolvl3);
            clearInterval(Intervalo_Dirlvl3); clearInterval(Intervalo_Dir2lvl3);
            clearInterval(Intervalo_Dir3lvl3); clearInterval(Intervalo_Dir4lvl3);
            clearTimeout(Arranque_1); clearTimeout(Arranque_2);
            clearTimeout(Arranque_3); clearTimeout(Arranque_4);

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
            document.getElementById("Pausa_Pantallalvl3").style.display = "none";
            document.getElementById("Fondo_Ciberpunk").play();
            
            Restar_Tiempolvl3 = setInterval(() => {
                if (nivel3Terminado || isPaused3) return;
                Tiempolvl3--;
                document.getElementById("Tiempolvl3").innerHTML = Tiempolvl3;
            }, 1000);

            Intervalo_Dirlvl3 = setInterval(() => {
                let el = document.getElementById('Meteoritolvl3');
                if(el) { el.style.transition = "1.9s"; el.style.left = "80%"; }
            }, 2950);
            Intervalo_Dir2lvl3 = setInterval(() => {
                let el = document.getElementById('Meteorito2lvl3');
                if(el) { el.style.transition = "1.9s"; el.style.left = "80%"; }
            }, 2750);
            Intervalo_Dir3lvl3 = setInterval(() => {
                let el = document.getElementById('Meteorito3lvl3');
                if(el) { el.style.transition = "1.9s"; el.style.left = "80%"; }
            }, 2550);
            Intervalo_Dir4lvl3 = setInterval(() => {
                let el = document.getElementById('Meteorito4lvl3');
                if(el) { el.style.transition = "1.9s"; el.style.left = "80%"; }
            }, 2150);

            meteoritos.forEach(id => {
                let el = document.getElementById(id);
                if(el) { el.style.transition = "1.9s"; el.style.left = "80%"; }
            });
        }
    });
}