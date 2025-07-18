// Variables para la posición del jugador
let jugadorFila = 14;
let jugadorColumna = 2;

// Variables de estado
let puntaje = 0;
let salud = 100;
let oleadaNumero = 1;

// Variable para el daño del jugador
let poderJugador = 1;

// Variables para animación de sprite
let direccionJugador = 'back'; // 'back', 'left', 'right', 'front'
let frameAnim = false;
let animInterval = null;
let personajeSprite = 'hero1.png'; // Por defecto

// --- Selección de personaje y preview ---
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

    // En selección de personaje, mostrar sprite de frente SOLO UNA VEZ
    let preview = document.getElementById('preview-personaje');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'preview-personaje';
        preview.style.width = '64px';
        preview.style.height = '64px';
        preview.style.margin = '0 auto 10px auto';
        preview.style.backgroundRepeat = 'no-repeat';
        preview.style.backgroundSize = '64px 256px';
        document.getElementById('pantalla-seleccion').insertBefore(preview, selectorPersonaje.parentNode);
    }
    function updatePreview() {
        const idx = parseInt(selectorPersonaje.value, 10);
        personajeSprite = `hero${idx}.png`;
        preview.style.backgroundImage = `url('sprites/${personajeSprite}')`;
        preview.style.backgroundPosition = '0px -128px';
    }
    selectorPersonaje.addEventListener('change', updatePreview);
    updatePreview();
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
        celdaActual.classList.remove('jugador', 'sprite-back', 'sprite-left', 'sprite-right', 'sprite-front', 'anim-move');
        celdaActual.textContent = '';
        celdaActual.style.backgroundImage = '';
    }
    // Actualizar la posición y dirección
    let movio = false;
    if (direccion === 'izquierda' && jugadorColumna > minColumnas) {
        jugadorColumna--;
        direccionJugador = 'left';
        movio = true;
    } else if (direccion === 'derecha' && jugadorColumna < maxColumnas) {
        jugadorColumna++;
        direccionJugador = 'right';
        movio = true;
    }
    if (movio) {
        animarMovimiento(direccionJugador);
    } else {
        direccionJugador = 'back';
        frameAnim = false;
        renderTablero();
        iniciarAnimacionIdle();
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
let enemigos = []; // {fila, columna, hp, jefe}
let buffs = [];    // {fila, columna, tipo}
let alertaJefePendiente = false;

// Función para mostrar alerta de jefe y pausar el juego
function mostrarAlertaJefe(callback) {
    const alerta = document.createElement('div');
    alerta.id = 'alerta-jefe';
    alerta.className = 'alert alert-danger fw-bold fs-3 position-fixed top-50 start-50 translate-middle text-center';
    alerta.style.zIndex = 9999;
    alerta.textContent = '¡OLEADA DE JEFE! Prepárate...';
    document.body.appendChild(alerta);
    setTimeout(() => {
        alerta.remove();
        if (callback) callback();
    }, 3000);
}

// Función para atacar al enemigo más cercano en la misma columna
function atacarEnemigo() {
    for (let fila = jugadorFila - 1; fila >= 0; fila--) {
        const enemigo = enemigos.find(e => e.fila === fila && e.columna === jugadorColumna);
        if (enemigo) {
            enemigo.hp -= poderJugador;
            reproducirSonidoAtaqueJugador();
            if (enemigo.hp <= 0) {
                enemigos = enemigos.filter(e => e !== enemigo);
                puntaje += enemigo.jefe ? 10 : PUNTAJE_ENEMIGO;
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
    if (oleadaNumero % 10 === 0) {
        // Oleada de jefe
        const cantidadJefes = Math.floor(oleadaNumero / 10);
        let columnasDisponibles = [0,1,2,3,4];
        for (let i = 0; i < cantidadJefes; i++) {
            // Distribuir jefes en columnas distintas si es posible
            let columna;
            if (columnasDisponibles.length > 0) {
                const idx = Math.floor(Math.random() * columnasDisponibles.length);
                columna = columnasDisponibles.splice(idx, 1)[0];
            } else {
                columna = Math.floor(Math.random() * 5);
            }
            enemigos.push({ fila: 0, columna, hp: JEFE_HP, jefe: true });
        }
        alertaJefePendiente = true;
    } else {
        // Generar enemigos normales
        for (let i = 0; i < oleadaNumero + 3; i++) {
            const fila = Math.floor(Math.random() * 5);
            const columna = Math.floor(Math.random() * 5);
            if (!enemigos.some(e => e.fila === fila && e.columna === columna)) {
                enemigos.push({ fila, columna, hp: ENEMIGO_HP, jefe: false });
            }
        }
        generarBuffs();
        alertaJefePendiente = false;
    }
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
            celda.style.backgroundImage = '';
            celda.style.backgroundPosition = '';
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
    // Dibujar enemigos y jefes
    enemigos.forEach(e => {
        const celda = document.getElementById(`celda-${e.fila}-${e.columna}`);
        if (celda) {
            if (e.jefe) {
                celda.classList.add('jefe');
                celda.style.backgroundColor = JEFE_COLOR;
                celda.textContent = e.hp;
            } else {
                celda.classList.add('enemigo');
                celda.style.backgroundColor = 'red';
                celda.textContent = e.hp;
            }
        }
    });
    // Dibujar jugador con sprite
    const celdaJugador = document.getElementById(`celda-${jugadorFila}-${jugadorColumna}`);
    if (celdaJugador) {
        celdaJugador.classList.add('jugador');
        celdaJugador.classList.remove('sprite-back', 'sprite-left', 'sprite-right', 'sprite-front', 'anim-move');
        let pos = '0px 0px';
        let clase = '';
        if (direccionJugador === 'back') {
            clase = 'sprite-back';
            pos = '0px 0px';
        } else if (direccionJugador === 'left') {
            clase = 'sprite-left';
            pos = '0px -64px';
        } else if (direccionJugador === 'front') {
            clase = 'sprite-front';
            pos = '0px -128px';
        } else if (direccionJugador === 'right') {
            clase = 'sprite-right';
            pos = '0px -192px';
        }
        // Animación: alterna entre frame de dirección y frame de espalda
        if (frameAnim && (direccionJugador === 'left' || direccionJugador === 'right')) {
            clase = 'sprite-back';
            pos = '0px 0px';
        }
        celdaJugador.classList.add(clase);
        celdaJugador.style.backgroundImage = `url('sprites/${personajeSprite}')`;
        celdaJugador.style.backgroundPosition = pos;
        celdaJugador.style.backgroundSize = '64px 256px';
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
let intervaloJuego = null;
let velocidadTick = 1000; // ms

function iniciarIntervaloJuego() {
    if (intervaloJuego) clearInterval(intervaloJuego);
    intervaloJuego = setInterval(tickJuego, velocidadTick);
}

function tickJuego() {
    if (!juegoEnCurso) return;
    // Pausa especial para oleada de jefe
    if (alertaJefePendiente) {
        alertaJefePendiente = false;
        mostrarAlertaJefe(() => {
            tickJuego();
        });
        return;
    }
    // Mover enemigos
    enemigos.forEach(e => {
        if (e.jefe) {
            // Jefe solo baja hasta fila 11
            if (e.fila < JEFE_RANGO_FILA) e.fila++;
        } else {
            // Enemigo normal baja hasta fila 13
            if (e.fila < 13) e.fila++;
        }
    });
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
    // Ataque de enemigos al jugador
    let enemigoAtaco = false;
    enemigos.forEach(e => {
        if (e.jefe) {
            // Jefe ataca si está en fila >= JEFE_RANGO_FILA
            if (e.fila >= JEFE_RANGO_FILA) {
                salud -= JEFE_DANO;
                enemigoAtaco = true;
            }
        } else {
            // Enemigo normal ataca si está en fila 13
            if (e.fila === 13) {
                salud -= 10;
                enemigoAtaco = true;
            }
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
        mostrarGameOver();
        return;
    }
    if (enemigos.length === 0) {
        // Si fue una oleada de jefe, aumentar velocidad
        if (oleadaNumero % 10 === 0) {
            velocidadTick = Math.max(velocidadTick - 50, 100); // No menos de 100ms
            iniciarIntervaloJuego();
        }
        oleadaNumero++;
        generarOleada(oleadaNumero);
    }
}

// Mostrar pantalla de Game Over y ranking
function mostrarGameOver() {
    document.getElementById('pantalla-juego').style.display = 'none';
    document.getElementById('pantalla-gameover').style.display = 'block';
    // Revisar si el puntaje entra al ranking y guardar si corresponde
    const nombre = document.getElementById('nombre-jugador') ? document.getElementById('nombre-jugador').value : 'Jugador';
    let puntajes = cargarPuntajes();
    let ranking = false;
    if (puntajes.length < 10 || puntaje > puntajes[puntajes.length - 1].score) {
        guardarPuntaje(nombre, puntaje, oleadaNumero);
        ranking = true;
        puntajes = cargarPuntajes(); // recargar para mostrar actualizado
    }
    const mensaje = ranking
        ? '¡Felicidades! Tu puntaje está en el Top 10.'
        : 'No entraste al Top 10. ¡Sigue intentando!';
    document.getElementById('mensaje-ranking').textContent = mensaje;
    mostrarPuntajes();
}

// Botón para volver al menú desde Game Over
if (document.getElementById('btn-volver-menu')) {
    document.getElementById('btn-volver-menu').addEventListener('click', () => {
        document.getElementById('pantalla-gameover').style.display = 'none';
        document.getElementById('pantalla-menu').style.display = 'block';
    });
}

// Función para cargar los puntajes del localStorage
function cargarPuntajes() {
    const puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
    return puntajes;
}

// Función para guardar un nuevo puntaje en el localStorage
function guardarPuntaje(nombre, score, oleada) {
    const puntajes = cargarPuntajes();
    puntajes.push({ nombre, score, oleada });
    puntajes.sort((a, b) => b.score - a.score);
    if (puntajes.length > 10) {
        puntajes.pop();
    }
    localStorage.setItem('puntajes', JSON.stringify(puntajes));
}

// Función para mostrar los puntajes en la tabla
function mostrarPuntajes() {
    const puntajes = cargarPuntajes();
    const tablaBody = document.querySelector('#pantalla-puntajes tbody');
    tablaBody.innerHTML = '';
    puntajes.forEach((puntaje, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${puntaje.nombre}</td>
            <td>${puntaje.score}</td>
            <td>${puntaje.oleada || '-'}</td>
        `;
        tablaBody.appendChild(fila);
    });
}

// --- Animación idle y movimiento ---
function iniciarAnimacionIdle() {
    if (animInterval) clearInterval(animInterval);
    animInterval = setInterval(() => {
        frameAnim = false;
        renderTablero();
    }, 400);
}
function detenerAnimacionIdle() {
    if (animInterval) clearInterval(animInterval);
}
function animarMovimiento(direccion) {
    detenerAnimacionIdle();
    let ticks = 0;
    if (animInterval) clearInterval(animInterval);
    animInterval = setInterval(() => {
        frameAnim = !frameAnim;
        renderTablero();
        ticks++;
        if (ticks > 3) { // 3 ciclos de animación
            clearInterval(animInterval);
            frameAnim = false;
            direccionJugador = 'back';
            renderTablero();
            iniciarAnimacionIdle();
            
        }
    }, 120);
}

// Función para iniciar el juego
function iniciarJuego() {
    juegoEnCurso = true;
    puntaje = 0;
    salud = 100;
    poderJugador = 1;
    oleadaNumero = 1;
    enemigos = [];
    velocidadTick = 1000;
    direccionJugador = 'back';
    frameAnim = false;
    iniciarIntervaloJuego();
    iniciarAnimacionIdle();
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

// Eliminar la declaración duplicada de intervaloJuego
// const intervaloJuego = setInterval(tickJuego, 1000);

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

    // En selección de personaje, mostrar sprite de frente
    // (esto se puede mejorar para que cambie según selección)
    const selectorPersonaje = document.getElementById('selector-personaje');
    const preview = document.createElement('div');
    preview.style.width = '64px';
    preview.style.height = '64px';
    preview.style.margin = '0 auto 10px auto';
    preview.style.backgroundRepeat = 'no-repeat';
    preview.style.backgroundSize = '64px 256px';
    document.getElementById('pantalla-seleccion').insertBefore(preview, selectorPersonaje.parentNode);
    function updatePreview() {
        const idx = parseInt(selectorPersonaje.value, 10);
        personajeSprite = `hero${idx}.png`;
        // Frame 3: mirando de frente (posición 0px -128px)
        preview.style.backgroundImage = `url('sprites/${personajeSprite}')`;
        preview.style.backgroundPosition = '0px -128px';
    }
    selectorPersonaje.addEventListener('change', updatePreview);
    updatePreview();
});
