// Variables para la posición del jugador
let jugadorFila = 14;
let jugadorColumna = 2;

// Variables de estado
let puntaje = 0;
let salud = 100;
let oleadaNumero = 1;

// Variable para el daño del jugador
let poderJugador = 1;

document.querySelector('#pantalla-menu .btn-primary').addEventListener('click', () => {
    document.getElementById('pantalla-menu').style.display = 'none';
    document.getElementById('pantalla-seleccion').style.display = 'block';
});

document.querySelector('#pantalla-menu .btn-secondary').addEventListener('click', () => {
    document.getElementById('pantalla-menu').style.display = 'none';
    document.getElementById('pantalla-puntajes').style.display = 'block';
    mostrarPuntajes();
});

document.querySelector('#pantalla-seleccion .btn-success').addEventListener('click', () => {
    document.getElementById('pantalla-seleccion').style.display = 'none';
    document.getElementById('pantalla-juego').style.display = 'block';
    iniciarJuego();
});

document.querySelector('#pantalla-puntajes .btn-secondary').addEventListener('click', () => {
    document.getElementById('pantalla-puntajes').style.display = 'none';
    document.getElementById('pantalla-menu').style.display = 'block';
});

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

// Estado de enemigos y buffs
let enemigos = []; // {fila, columna, hp}
let buffs = [];    // {fila, columna, tipo}

// Función para atacar al enemigo más cercano en la misma columna
function atacarEnemigo() {
    for (let fila = jugadorFila - 1; fila >= 0; fila--) {
        const enemigo = enemigos.find(e => e.fila === fila && e.columna === jugadorColumna);
        if (enemigo) {
            enemigo.hp -= poderJugador;
            reproducirSonidoAtaqueJugador();
            if (enemigo.hp <= 0) {
                enemigos = enemigos.filter(e => e !== enemigo);
                puntaje += PUNTAJE_ENEMIGO;
                reproducirSonidoEliminarEnemigo();
            }
            renderTablero();
            actualizarUI();
            break;
        }
    }
}

// Generar buffs aleatorios, entre 0 y 2 por oleada, siempre en la fila superior y en columnas libres
function generarBuffs() {
    let nuevosBuffs = [];
    let columnasUsadas = buffs.filter(b => b.fila === 0).map(b => b.columna);
    let cantidadBuffs = Math.floor(Math.random() * 3); // 0, 1 o 2
    let intentos = 0;
    while (nuevosBuffs.length < cantidadBuffs && intentos < 10) {
        const columna = Math.floor(Math.random() * 5);
        if (!columnasUsadas.includes(columna)) {
            // Solo agregar si no hay enemigo en fila 0 y esa columna
            if (!enemigos.some(e => e.fila === 0 && e.columna === columna)) {
                const tipo = BUFFS[Math.floor(Math.random() * BUFFS.length)].tipo;
                nuevosBuffs.push({ fila: 0, columna, tipo });
                columnasUsadas.push(columna);
            }
        }
        intentos++;
    }
    buffs = buffs.concat(nuevosBuffs);
}

// Modificar generarOleada para NO reiniciar buffs y solo reiniciar enemigos
function generarOleada(oleadaNumero) {
    enemigos = [];
    // buffs no se reinician
    // Generar enemigos
    for (let i = 0; i < oleadaNumero + 3; i++) {
        const fila = Math.floor(Math.random() * 5);
        const columna = Math.floor(Math.random() * 5);
        if (!enemigos.some(e => e.fila === fila && e.columna === columna)) {
            enemigos.push({ fila, columna, hp: ENEMIGO_HP });
        }
    }
    generarBuffs();
    renderTablero();
}

// Renderizar tablero con enemigos y buffs
function renderTablero() {
    // Limpiar tablero
    for (let fila = 0; fila < 15; fila++) {
        for (let columna = 0; columna < 5; columna++) {
            const celda = document.getElementById(`celda-${fila}-${columna}`);
            celda.className = 'celda';
            celda.style.backgroundColor = '';
            celda.textContent = '';
        }
    }
    // Dibujar buffs
    buffs.forEach(b => {
        const celda = document.getElementById(`celda-${b.fila}-${b.columna}`);
        if (celda) {
            celda.classList.add('buff');
            celda.style.backgroundColor = 'green';
            celda.textContent = BUFFS.find(x => x.tipo === b.tipo).texto;
        }
    });
    // Dibujar enemigos
    enemigos.forEach(e => {
        const celda = document.getElementById(`celda-${e.fila}-${e.columna}`);
        if (celda) {
            celda.classList.add('enemigo');
            celda.style.backgroundColor = 'red';
            celda.textContent = e.hp;
        }
    });
    // Dibujar jugador
    const celdaJugador = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (celdaJugador) {
        celdaJugador.classList.add('jugador');
        celdaJugador.style.backgroundColor = 'blue';
        celdaJugador.textContent = '';
    }
}

// Variable para controlar si el juego está en curso
let juegoEnCurso = false;

// Función para actualizar la UI
function actualizarUI() {
    document.getElementById('indicador-puntaje').textContent = puntaje;
    document.getElementById('indicador-salud').textContent = salud;
    document.getElementById('indicador-oleada').textContent = oleadaNumero;
    if (document.getElementById('indicador-poder')) {
        document.getElementById('indicador-poder').textContent = poderJugador;
    }
}

// Modificar tickJuego para mover enemigos y buffs usando los arrays
function tickJuego() {
    if (!juegoEnCurso) return;
    // Mover enemigos (solo hasta fila 13)
    enemigos.forEach(e => { if (e.fila < 13) e.fila++; });
    // Mover buffs (hasta fila 14, SIEMPRE bajan aunque haya enemigo)
    buffs.forEach(b => {
        if (b.fila < 14) {
            b.fila++;
        }
    });
    // Colisiones buffs con jugador y eliminación en la fila inferior
    buffs = buffs.filter(b => {
        if (b.fila === jugadorFila && b.columna === jugadorColumna) {
            if (b.tipo === 'HP') salud = Math.min(100, salud + 10);
            if (b.tipo === 'ATK') poderJugador++;
            reproducirSonidoRecogerBuff();
            return false;
        }
        // Eliminar buff si llegó a la fila inferior y el jugador no lo recogió
        if (b.fila >= 14) {
            return false;
        }
        return true;
    });
    // Ataque de enemigos al jugador (si están en fila 13, sin importar columna)
    let enemigoAtaco = false;
    enemigos.forEach(e => {
        if (e.fila === 13) {
            salud -= 10;
            enemigoAtaco = true;
        }
    });
    if (enemigoAtaco) {
        reproducirSonidoAtaqueEnemigo();
    }
    // Eliminar buffs fuera del tablero
    buffs = buffs.filter(b => b.fila < 15);
    // Actualizar UI
    actualizarUI();
    renderTablero();
    // Verificar condiciones de final de oleada o juego
    if (salud <= 0) {
        salud = 0;
        juegoEnCurso = false;
        reproducirSonidoGameOver();
        alert('¡Game Over!');
        return;
    }
    if (enemigos.length === 0) {
        oleadaNumero++;
        generarOleada(oleadaNumero);
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

// Función para iniciar el juego
function iniciarJuego() {
    juegoEnCurso = true;
    puntaje = 0;
    salud = 100;
    poderJugador = 1;
    oleadaNumero = 1;
    enemigos = [];
    // buffs no se reinician
    initTablero();
    generarOleada(oleadaNumero);
    actualizarUI();
    console.log('Juego iniciado.');
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
const intervaloJuego = setInterval(tickJuego, 1000);

// --- MANEJO DE PANTALLAS Y BOTONES ---

document.addEventListener('DOMContentLoaded', function() {
    // Botón Iniciar Juego Nuevo
    const btnIniciar = document.querySelector('#pantalla-menu .btn-primary');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            document.getElementById('pantalla-menu').style.display = 'none';
            document.getElementById('pantalla-seleccion').style.display = 'block';
        });
    }

    // Botón Ver Puntajes
    const btnPuntajes = document.querySelector('#pantalla-menu .btn-secondary');
    if (btnPuntajes) {
        btnPuntajes.addEventListener('click', () => {
            document.getElementById('pantalla-menu').style.display = 'none';
            document.getElementById('pantalla-puntajes').style.display = 'block';
            mostrarPuntajes();
        });
    }

    // Botón Iniciar Juego en selección de personaje
    const btnIniciarJuego = document.querySelector('#pantalla-seleccion .btn-success');
    if (btnIniciarJuego) {
        btnIniciarJuego.addEventListener('click', () => {
            document.getElementById('pantalla-seleccion').style.display = 'none';
            document.getElementById('pantalla-juego').style.display = 'block';
            iniciarJuego();
        });
    }

    // Botón Volver al Menú en pantalla de puntajes
    const btnVolverMenu = document.querySelector('#pantalla-puntajes .btn-secondary');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            document.getElementById('pantalla-puntajes').style.display = 'none';
            document.getElementById('pantalla-menu').style.display = 'block';
        });
    }
});

// Exportar la función si es necesario
// export { initTablero };
