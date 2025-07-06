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

// Función para atacar al enemigo más cercano en la misma columna
function atacarEnemigo() {
    for (let fila = jugadorFila - 1; fila >= 0; fila--) {
        const celda = document.getElementById(`celda-${fila}-${jugadorColumna}`);
        if (celda && celda.classList.contains('enemigo')) {
            celda.classList.remove('enemigo');
            celda.style.backgroundColor = '';
            console.log('Enemigo atacado en fila:', fila, 'columna:', jugadorColumna);
            break;
        }
    }
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

// Exportar la función si es necesario
// export { initTablero };
