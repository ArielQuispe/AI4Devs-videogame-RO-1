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
    rango_fila: 13,
    ancho: 48,
    alto: 48
  },
  {
    tipo: 'jefe',
    nombre: 'Jefe',
    hp: 20,
    atk: 20,
    puntaje: 10,
    sprite: 'boss1.png',
    color: '#8B0000',
    rango_fila: 11,
    ancho: 96,
    alto: 96
  }
];
const BUFFS = [
  { tipo: 'HP', texto: 'HP' },
  { tipo: 'ATK', texto: 'ATK' }
];