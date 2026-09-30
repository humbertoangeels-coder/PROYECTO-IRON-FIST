let Tiempolvl2 = 61;
let Puntajelvl2 = 0;
const metaPuntosLvl2 = 34;
let nivel2Terminado = false;

let Restar_Tiempolvl2, Reanudar_trayectorialvl2, Reanudar_trayectoria2lvl2, Reanudar_trayectoria3lvl2;
let Activador_iniciallvl2, Activador_inicial2lvl2, Activador_inicial3lvl2, perdisteLoopLvl2;

function JUEGOlvl2() {
    nivel2Terminado = false;

    function Tiempo_Disminurlvl2() {
        if (nivel2Terminado) return;
        Tiempolvl2--;
        document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2;
        if (Tiempolvl2 <= 0) {
            document.getElementById("Perdiste_sound").play();
            alert("El tiempo se agotó. Has fallado la misión.");
            reiniciarEstadoLvl2();
        }
    }
    Restar_Tiempolvl2 = setInterval(Tiempo_Disminurlvl2, 1000);

    const meteoritos = ['Meteioritolvl2', 'Meteiorito2lvl2', 'Meteiorito3lvl2'];
    meteoritos.forEach(id => {
        let el = document.getElementById(id);
        let newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        newEl.addEventListener('mouseover', Aumentar_Puntoslvl2);
        newEl.addEventListener('mouseover', () => Explulsarlvl2(newEl.id));
    });

    function Aumentar_Puntoslvl2() {
        if (nivel2Terminado) return;
        Puntajelvl2++;
        document.getElementById("Puntajelvl2").innerHTML = Puntajelvl2 + " / " + metaPuntosLvl2;
        
        if (Puntajelvl2 >= metaPuntosLvl2) {
            terminarJuegoLvl2();
        }
    }

    function terminarJuegoLvl2() {
        nivel2Terminado = true;
        document.getElementById("Tiempolvl2").innerHTML = 60;
        document.getElementById("Fondo_Ciberpunk").pause();
        document.getElementById("Triunfo").play();
        
        document.getElementById("NEXT").addEventListener('click', () => {
            document.getElementById("NIVEL_01").style.display = "none";
            document.getElementById("NIVEL_02").style.display = "none";
            document.getElementById("NIVEL3").style.display = "block";
        });

        detenerMeteoritosLvl2();
        document.getElementById("GanastePantallaLvL2").style.display = "flex";
        
        Swal.fire({
            title: 'FELICIDADES POR SUPERAR <br> EL NIVEL <br><br> <img src="IMG/Check.png" width="120px"><br>',
            html: '¿VERDAD QUE FUE DIFÍCIL? Prepárate para el siguiente nivel que las cosas van a empeorar. Agradecemos tu dedicación en pasar este nivel, esperemos que puedas seguir defendiendo la tierra de esa manera y mejores tu habilidad de reacción.',
            icon: 'success',
            confirmButtonText: 'QUIERO CONTINUAR',
            width: '50%', height: '80%', timer: 100000, timerProgressbar: true,
            allowOutsideClick: true, allowEscapeKey: false, allowEnterKey: false, stopKeydownPropagation: false,
        });

        Puntajelvl2 = 0;
        Tiempolvl2 = 61;
    }

    function detenerMeteoritosLvl2() {
        clearInterval(Reanudar_trayectorialvl2);
        clearTimeout(Activador_iniciallvl2);
        clearInterval(Reanudar_trayectoria2lvl2);
        clearTimeout(Activador_inicial2lvl2);
        clearInterval(Reanudar_trayectoria3lvl2);
        clearTimeout(Activador_inicial3lvl2);
        clearInterval(Restar_Tiempolvl2);
        clearInterval(perdisteLoopLvl2);

        meteoritos.forEach(id => {
            let el = document.getElementById(id);
            if(el) {
                el.style.left = "-70%";
                el.style.transition = "0s";
            }
        });
    }

    function iniciarTrayectoriaLvl2(id, distancia, velocidad) {
        let el = document.getElementById(id);
        if(el){
            let altura = Math.round(Math.random() * 450);
            el.style.left = distancia + "%";
            el.style.top = altura + "px";
            el.style.transition = velocidad + "s";
        }
    }

    Activador_iniciallvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteioritolvl2', 80, 2), 3500);
    Reanudar_trayectorialvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteioritolvl2', 80, 2), 2030);

    Activador_inicial2lvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteiorito2lvl2', 80, 2), 3000);
    Reanudar_trayectoria2lvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteiorito2lvl2', 80, 2), 2750);

    Activador_inicial3lvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteiorito3lvl2', 80, 2), 2200);
    Reanudar_trayectoria3lvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteiorito3lvl2', 80, 2), 2470);

    function Explulsarlvl2(id) {
        let sound;
        if (id === 'Meteioritolvl2') sound = document.getElementById("Puntos_sound");
        else if (id === 'Meteiorito2lvl2') sound = document.getElementById("Punto2");
        else sound = document.getElementById("Punto3");
        
        if(sound) {
            sound.currentTime = 0;
            sound.play(); 
        }
        let el = document.getElementById(id);
        let altura = Math.round(Math.random() * 450);
        el.style.left = "-500px";
        el.style.top = altura + "px";
        el.style.transition = "1.8s";
    }

    function checkPerdisteLvl2() {
        if (nivel2Terminado) return;
        let m1 = document.getElementById("Meteioritolvl2");
        let m2 = document.getElementById("Meteiorito2lvl2");
        let m3 = document.getElementById("Meteiorito3lvl2");

        if ((m1 && m1.offsetLeft > 630) || (m2 && m2.offsetLeft > 630) || (m3 && m3.offsetLeft > 630)) {
            nivel2Terminado = true;
            document.getElementById("Perdiste_sound").play();
            alert("YA ES DEMASIADO TARDE, LOS METEORITOS DESTRUYERON GRAN PARTE DEL CONTINENTE Y LO MEJOR ES ESPERAR LO PEOR");
            reiniciarEstadoLvl2();
        }
    }
    perdisteLoopLvl2 = setInterval(checkPerdisteLvl2, 20);

    function reiniciarEstadoLvl2() {
         detenerMeteoritosLvl2();
         Tiempolvl2 = 61;
         Puntajelvl2 = 0;
         document.getElementById("Tiempolvl2").innerHTML = 60;
         document.getElementById("Puntajelvl2").innerHTML = "0 / " + metaPuntosLvl2;
         nivel2Terminado = false;
         
         Activador_iniciallvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteioritolvl2', 80, 2), 2000);
         Reanudar_trayectorialvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteioritolvl2', 80, 2), 2030);

         Activador_inicial2lvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteiorito2lvl2', 80, 2), 2500);
         Reanudar_trayectoria2lvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteiorito2lvl2', 80, 2), 2750);

         Activador_inicial3lvl2 = setTimeout(() => iniciarTrayectoriaLvl2('Meteiorito3lvl2', 80, 2), 3000);
         Reanudar_trayectoria3lvl2 = setInterval(() => iniciarTrayectoriaLvl2('Meteiorito3lvl2', 80, 2), 2470);

         Restar_Tiempolvl2 = setInterval(Tiempo_Disminurlvl2, 1000);
         perdisteLoopLvl2 = setInterval(checkPerdisteLvl2, 20);
    }
}

document.getElementById("Playlvl2").addEventListener('click', PLAYlvl2);
let Conteolvl2 = 4;

function PLAYlvl2() {
    document.getElementById("Fondo_Ciberpunk").play();
    document.getElementById("Texolvl2").style.left = "-900px";
    document.getElementById("Playlvl2").style.left = "-900px";
    document.getElementById("Dificultad").style.left = "-900px";

    setTimeout(JUEGOlvl2, 4100);

    let cuentaRegresiva = setInterval(() => {
        Conteolvl2--;
        document.getElementById("RGBlvl2").innerHTML = Conteolvl2;
        if (Conteolvl2 === -1) {
            clearInterval(cuentaRegresiva);
            document.getElementById("Contenedor_contadorlvl2").style.display = "none";
            document.getElementById("Startlvl2").style.display = "none";
            DETENER_JUEGOlvl2();
        }
    }, 1000);
}

let ActivoLvl2 = true;
function DETENER_JUEGOlvl2() {
    document.getElementById("Pauselvl2").addEventListener('click', () => {
        if (nivel2Terminado) return;
        const meteoritos = ['Meteioritolvl2', 'Meteiorito2lvl2', 'Meteiorito3lvl2'];
        
       if (ActivoLvl2) {
            document.getElementById("Pausa_Pantallalvl2").style.display = "flex"; 
            document.getElementById("Fondo_Ciberpunk").pause();
            
            clearInterval(Restar_Tiempolvl2);
            clearInterval(Reanudar_trayectorialvl2);
            clearInterval(Reanudar_trayectoria2lvl2);
            clearInterval(Reanudar_trayectoria3lvl2);
            clearTimeout(Activador_iniciallvl2);
            clearTimeout(Activador_inicial2lvl2);
            clearTimeout(Activador_inicial3lvl2);
            clearInterval(perdisteLoopLvl2); // SE DETIENE LA CONDICIÓN GAME OVER
            
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
            document.getElementById("Pausa_Pantallalvl2").style.display = "none";
            document.getElementById("Fondo_Ciberpunk").play();
            
            Restar_Tiempolvl2 = setInterval(() => {
                Tiempolvl2--;
                document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2;
            }, 1000);
            
            // SE REANUDAN LOS METEORITOS Y EL GAMEOVER
            Reanudar_trayectorialvl2 = setInterval(() => {
                let el = document.getElementById('Meteioritolvl2');
                if(el) { el.style.transition = "2s"; el.style.left = "80%"; }
            }, 2030);
            
            Reanudar_trayectoria2lvl2 = setInterval(() => {
                let el = document.getElementById('Meteiorito2lvl2');
                if(el) { el.style.transition = "2s"; el.style.left = "80%"; }
            }, 2750);
            
            Reanudar_trayectoria3lvl2 = setInterval(() => {
                let el = document.getElementById('Meteiorito3lvl2');
                if(el) { el.style.transition = "2s"; el.style.left = "80%"; }
            }, 2470);

            perdisteLoopLvl2 = setInterval(checkPerdisteLvl2, 20);

            meteoritos.forEach(id => {
                let el = document.getElementById(id);
                if(el) {
                    el.style.transition = "2s";
                    el.style.left = "80%";
                }
            });
        }
        ActivoLvl2 = !ActivoLvl2;
    });
}