// Valores de configuración del juego
const ENEMIGOS = [
  {
    tipo: 'normal',
    nombre: 'Enemigo',
    hp: 3,
    atk: 10,
    puntaje: 1,
    sprite: 'enemy1.png',
    color: '#bb0404ff',
    rango_fila: 12,
    ancho: 64,
    alto: 64
  },
  {
    tipo: 'jefe',
    nombre: 'Jefe',
    hp: 20,
    atk: 20,
    puntaje: 10,
    sprite: 'boss1.png',
    color: '#8B0000',
    rango_fila: 10,
    ancho: 128,
    alto: 128
  }
];
const BUFFS = [
  { tipo: 'HP', texto: 'HP' },
  { tipo: 'ATK', texto: 'ATK' }
];

// Configuración del jugador principal
const JUGADOR = {
  oleada: 1,
  nombre: 'Jugador',
  vidaMax: 100,
  vida: 100,
  poder: 1,
  puntaje: 0,
  cooldownDisparo: 300, // ms
  puedeDisparar: true,
  sprite: 'hero1.png', // se actualiza según selección
  columnaInicial: 2,
  filaInicial: 14,
  direccion: 'back' // 'back', 'left', 'right', 'front'
};

const TABLERO = {
  filas: 15,
  columnas: 5,
  anchoCelda: 48,
  altoCelda: 32,
  oleadaInicial: 1,
  oleadaJefe: 10
}