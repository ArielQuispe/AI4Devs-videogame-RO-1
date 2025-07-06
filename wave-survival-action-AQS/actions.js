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
    const jugadorFila = 14;
    const jugadorColumna = 2;
    const celdaJugador = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (celdaJugador) {
        celdaJugador.style.backgroundColor = 'blue'; // Representar al jugador
    }
}

// Exportar la función si es necesario
// export { initTablero };
