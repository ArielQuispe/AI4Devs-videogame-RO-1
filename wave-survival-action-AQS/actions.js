// Variables para la posición del jugador
let jugadorFila = 14;
let jugadorColumna = 2;

// Función para inicializar el tablero
function initTablero() {
    const tablero = document.getElementById('tablero');

    // Limpiar el tablero si ya tiene contenido
    tablero.innerHTML = '';

    // Generar las celdas del tablero
    for (let fila = 0; fila < 15; fila++) {
        for (let columna = 0; columna < 5; columna++) {
            const celda = document.createElement('div');
            celda.id = `celda-${fila}-${columna}`;
            celda.className = 'celda';
            celda.style.border = '1px solid #ccc';
            celda.style.width = '40px';
            celda.style.height = '40px';
            tablero.appendChild(celda);
        }
    }

    // Inicializar la posición del jugador
    const celdaJugador = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (celdaJugador) {
        celdaJugador.style.backgroundColor = 'blue'; // Representar al jugador
    }
}

// Función para mover al jugador
function moverJugador(direccion) {
    const maxColumnas = 4;
    const minColumnas = 0;

    // Limpiar la celda actual del jugador
    const celdaActual = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (celdaActual) {
        celdaActual.style.backgroundColor = '';
    }

    // Actualizar la posición del jugador
    if (direccion === 'izquierda' && jugadorColumna > minColumnas) {
        jugadorColumna--;
    } else if (direccion === 'derecha' && jugadorColumna < maxColumnas) {
        jugadorColumna++;
    }

    // Dibujar al jugador en la nueva posición
    const nuevaCelda = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (nuevaCelda) {
        nuevaCelda.style.backgroundColor = 'blue';
    }
}

// Cargar sonidos
const sonidoAtaqueJugador = new Audio('sounds/ataque-jugador.wav');
const sonidoAtaqueEnemigo = new Audio('sounds/ataque-enemigo.mp3');
const sonidoEliminarEnemigo = new Audio('sounds/eliminar-enemigo.wav');
const sonidoRecogerBuff = new Audio('sounds/recoger-buff.wav');
const sonidoGameOver = new Audio('sounds/game-over.wav');

// Función para reproducir sonido de ataque del jugador
function reproducirSonidoAtaqueJugador() {
    sonidoAtaqueJugador.play();
}

// Función para reproducir sonido de ataque del enemigo
function reproducirSonidoAtaqueEnemigo() {
    sonidoAtaqueEnemigo.play();
}

// Función para reproducir sonido al eliminar un enemigo
function reproducirSonidoEliminarEnemigo() {
    sonidoEliminarEnemigo.play();
}

// Función para reproducir sonido al recoger un buff
function reproducirSonidoRecogerBuff() {
    sonidoRecogerBuff.play();
}

// Función para reproducir sonido de game over
function reproducirSonidoGameOver() {
    sonidoGameOver.play();
}

// Función para atacar al enemigo más cercano en la misma columna
function atacarEnemigo() {
    for (let fila = jugadorFila - 1; fila >= 0; fila--) {
        const celda = document.getElementById(`celda-${fila}-${jugadorColumna}`);
        if (celda && celda.classList.contains('enemigo')) {
            celda.classList.remove('enemigo');
            celda.style.backgroundColor = '';
            reproducirSonidoEliminarEnemigo();
            console.log('Enemigo atacado en fila:', fila, 'columna:', jugadorColumna);
            break;
        }
    }
    reproducirSonidoAtaqueJugador();
}

// Función para generar una oleada de enemigos y buffs
function generarOleada(oleadaNumero) {
    const tablero = document.getElementById('tablero');

    // Generar enemigos
    for (let i = 0; i < oleadaNumero + 3; i++) { // Más enemigos con cada oleada
        const fila = Math.floor(Math.random() * 5);
        const columna = Math.floor(Math.random() * 5);
        const celda = document.getElementById(`celda-${fila}-${columna}`);
        if (celda && !celda.classList.contains('enemigo')) {
            celda.classList.add('enemigo');
            celda.style.backgroundColor = 'red';
        }
    }

    // Generar buffs
    for (let i = 0; i < 2; i++) { // Dos buffs por oleada
        const fila = Math.floor(Math.random() * 5);
        const columna = Math.floor(Math.random() * 5);
        const celda = document.getElementById(`celda-${fila}-${columna}`);
        if (celda && !celda.classList.contains('enemigo') && !celda.classList.contains('buff')) {
            celda.classList.add('buff');
            celda.style.backgroundColor = 'green';
        }
    }
}

// Función para ejecutar el tick del juego
function tickJuego() {
    const tablero = document.getElementById('tablero');

    // Mover enemigos
    for (let fila = 14; fila >= 0; fila--) {
        for (let columna = 0; columna < 5; columna++) {
            const celda = document.getElementById(`celda-${fila}-${columna}`);
            if (celda && celda.classList.contains('enemigo')) {
                celda.classList.remove('enemigo');
                celda.style.backgroundColor = '';
                const nuevaFila = fila + 1;
                if (nuevaFila < 15) {
                    const nuevaCelda = document.getElementById(`celda-${nuevaFila}-${columna}`);
                    if (nuevaCelda) {
                        nuevaCelda.classList.add('enemigo');
                        nuevaCelda.style.backgroundColor = 'red';
                    }
                } else {
                    reproducirSonidoGameOver();
                    console.log('El enemigo alcanzó al jugador. Fin del juego.');
                    clearInterval(intervaloJuego);
                }
            }
        }
    }

    // Realizar ataques enemigos (lógica adicional puede ser implementada aquí)

    // Mover buffs (si es necesario, lógica adicional puede ser implementada aquí)

    // Verificar condiciones de final de oleada o juego
    const enemigosRestantes = document.querySelectorAll('.enemigo').length;
    if (enemigosRestantes === 0) {
        console.log('Oleada completada. Generando nueva oleada.');
        generarOleada(oleadaNumero++);
    }
}

// Función para cargar los puntajes del localStorage
function cargarPuntajes() {
    const puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
    return puntajes;
}

// Función para guardar un nuevo puntaje en el localStorage
function guardarPuntaje(nombre, score) {
    const puntajes = cargarPuntajes();

    // Insertar el nuevo puntaje
    puntajes.push({ nombre, score });

    // Ordenar los puntajes de mayor a menor
    puntajes.sort((a, b) => b.score - a.score);

    // Mantener solo los top 10
    if (puntajes.length > 10) {
        puntajes.pop();
    }

    // Guardar los puntajes actualizados en el localStorage
    localStorage.setItem('puntajes', JSON.stringify(puntajes));
}

// Función para mostrar los puntajes en la tabla
function mostrarPuntajes() {
    const puntajes = cargarPuntajes();
    const tablaBody = document.querySelector('#pantalla-puntajes tbody');

    // Limpiar la tabla
    tablaBody.innerHTML = '';

    // Llenar la tabla con los puntajes
    puntajes.forEach((puntaje, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${puntaje.nombre}</td>
            <td>${puntaje.score}</td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Listeners para las teclas
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            moverJugador('izquierda');
            break;
        case 'ArrowRight':
            moverJugador('derecha');
            break;
        case ' ':
            atacarEnemigo();
            break;
    }
});

// Iniciar el intervalo del juego
let oleadaNumero = 1;
const intervaloJuego = setInterval(tickJuego, 1000);

// Exportar la función si es necesario
// export { initTablero };
