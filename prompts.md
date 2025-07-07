# Iniciando a realizar metaprompting para aterrizar las ideas
Vamos a iniciar utilizando Chat GPT (free plan) en el navegador
## Prompt 1: Chat GPT
Quiero hacer un juego, pero desconozco cual es el nombre que ayudaría para que un asistente de código pueda ayudarme a crearlo más facilmente:
El juego consiste en que vienen olas de mob/enemigos y entre medio aparecen cosas que te van dando bonificaciones para que tu personaje pueda pegar más fuerte, se mueva más rapido, entre otras mejoras que pudieran existir, cada cierta cantidad de rondas, aparecería un enemigo que debes derrotar, y así continuar hasta que se te acabe la vida.
Como se llaman este tipo de juegos?

## Prompt 2: Chat GPT
Actua como arquitecto, para crear un video juego con la dinámica "wave survival action game"
# Características Tecnologías
* HTML
* CSS utilizar Bootstrap 5 principalmente
* Javascript sin frameworks adicionales, aunque podemos usar librerías que se puedan importar sin frameworks
* Aplicación solo funciona en el cliente/navegador, no se conecta a API
# Estructura del proyecto
El proyecto debe estar dentro de la carpeta `wave-survival-action-AQS` y mantendremos las partes separadas de la siguiente forma:

```
wave-survival-action-AQS/
├── index.html           # Código principal del juego
├── actions.js           # Acciones y eventos de JavaScript
├── values.js            # Valores iniciales para jugador, enemigos, buffs, etc.
├── style.css            # Estilos personalizados (complementando Bootstrap)
└── assets/              # Imágenes y recursos necesarios para el proyecto
    ├── characters/      # Sprites de los héroes/personajes seleccionables
    ├── enemies/         # Sprites de los enemigos del juego
    └── buffs/           # Sprites de las mejoras (buffs) para el héroe
```

# Dinámicas del UI
* Hay un primer menú en el que el usuario puede elegir que quiere hacer:
    * Iniciar un juego nuevo
    * Ver puntajes
* Si el usuario inicia un nuevo juevo:
    * Usuario debe elegir su personaje
    * Usuario le da un nombre a su personaje
    * Inicia el juego
* Si el usuario ve sus puntajes:
    * Se muestran los 10 mejores puntajes almacenados
    * Tiene un botón para volver al inicio
* La pantalla de juego, recibe el nombre de tablero, en donde se disponen todos los elementos del juego
# Elementos del juego
## Tablero 
* La pantalla de juego es una grilla de 5 x 15, en dispocisión vertical, las cuales tendrán una coordinada x,y, donde 0,0 es la esquina superior izquierda y 5,14 es la esquina inferior derecha, esto lo llamaremos tablero
* Se llamará columna a las coordenadas x, es decir, tendremos 5 columnas en total, la columna más a la izquierda es 0 y la columna más a la derecha es 4
* Se llamará fila a las coordenadas y, es decir, tendremos 15 filas en total, la fila más arriba es 0 y la fila más abajo es 14
# Personaje o jugador
* El personaje solo puede estar en las casillas con fila 14, es decir las casillas inferiores, y debe ser capaz de moverse en ellas una a una, al apretar las teclas izquierda o derecha del teclado, nunca puede moverse hacia arriba, ni abajo (porque saldría del tablero)
* El personaje puede dañar a cualquier enemigo (normal o jefe) en la misma columna. El daño se realiza cuando el usuario presiona la tecla espacio en el teclado. El daño que hace es [character_damage_value].
* El personaje tiene puntos de salud, que indica cuanto daño puede recibir. Cuando sus puntos de salud lleguen a 0, el juego se acaba. Los puntos de salud son [character_hp_value]
* Para las pruebas el personaje tendra color azul
# Enemigos
* Todos los enemigos aparecen en la parte superior del tableroa y avanzan 1 casilla verticalmente hacia el personaje, pueden aparecer aleatoriamente en cualquiera de las 5 columna, pero mantienen su dirección en las filas.
* Los enemigos pueden hacer daño al jugador [enemy_damage_value], siempre y cuando se encuentre en la fila de su rango de ataque
* Los enemigos tienen puntos de salud [enemy_hp_value], al llegar a cero, estos desaparecen del tablero, y no pueden continuar atacando ni acercandose al jugador, es decir, son eliminados
* Los enemigos tienen una velocidad, es decir, se acercan una casilla hacia el jugador por cada [enemy_speed_value] segundos
* Los enemigos tienen un rango de ataque [enemy_range_value], que indica la cantidad de filas que debe tener de diferencia para poder hacer daño, sin considerar en que columna del tablero se encuentren
* Los enemigos al morir, le dan un puntaje [enemy_score_value] al jugador que se suma al puntaje acumulado.
* Si un enemigo está en rango de ataque, no debe continuar avanzando hacia el jugador
* Para las pruebas el enemigo tendra color rojo
## Enemigos normales
Los enemigos normales tiene las siguientes condiciones:
* [enemy_damage_value] = 2
* [enemy_hp_value] = 3
* [enemy_speed_value] = 2
* [enemy_range_value] = 1
* [enemy_score_value] = 1
* Aparecen en las oleadas que no sean multiplos de 20
## Enemigos Jefe
* [enemy_damage_value] = 4
* [enemy_hp_value] = 20
* [enemy_speed_value] = 2
* [enemy_range_value] = 3
* [enemy_score_value] = 10
* Aparecen en las oleadas que sean multiplos de 20
# Buffs
* Los buffs aparecen aleatoriamente en cada oleada y le dan alguna mejora al jugador
* Los buff pueden aparecer en cualquier columna en la parte superior
* Tienen una velocidad de caida de una casilla por [buff_speed_value] segundo
* Cuando llegan a la fila 14 (la fila del personaje) Si el personaje está en la misma columna que el buff, el jugador recibe el bono que entrega el buff asociado, despues desaparece del tablero.
* Si llega a la fila 14 y el jugador no está ahí, el buff desaparece del tablero, sin entregar su bono
## Buff de puntos de salud
* Al ser recibido por el jugador, incrementa [buff_hp_bonus_value] a los puntos de salud actuales del jugador.
## Buff de daño
* Al ser recibido por el jugador, incrementa en [buff_damage_bonus_value] el daño actual del jugador
## Otros buff
* No vamos a definirlos ahora, pero considerar que agregaremos otros buffs más adelante
# Oleadas
* Las oleadas indican un objetivo inmediato que el jugador debe cumplir, que es matar todos los enemigos presentes en el tablero, para que inicie la siguiente oleada
* Las oleadas inician en 1, y cada vez que se completa, se inicia la siguiente oleada
* Las oleadas normales (no son multiplo de 20), deben generar el [número de la oleada + 1] enemigos normales, que inician en la parte superior del tablero, y comienzan a bajar hacia el jugador
* Las oleadas jefes (son multiplo de 20), deben generar el [número de la oleada /20 + 1] enemigos jefe, que inician en la parte superior del tablero, y comienzan a bajar hacia el jugador
* En cada oleadas, debe aparecerán de forma aleatoria entre 1 a 2 buffs, el cual el personaje debe tocar, para ganar el buff
# Jugabilidad
* El juego inicia con la oleada 1
* Cada vez que el jugador elimina a un enemigo, gana su puntaje, y lo va acumulando
* Si el jugador elimina a todos los enemigos en el tablero, inicia la siguiente oleada
* Si el jugador pierde todos sus puntos de vida, es decir [character_hp_value] es igual a 0, el juego se da por terminado
* Cuando el juego a terminado, si su puntaje está dentro de los 10 mejores registrados, se registra en los mejores puntajes
* Cuando el juego a terminado, el juego vuelve al menu inicial
# Valores o propiedades de los elementos de juego
* Los valores de vida/salud, ataque, velocidades y puntajes del personaje y enemigos los iremos ajustando según las pruebas que se realicen. Establece valores iniciales que consideres adecuado para este tipo de video juegos en el archivo values.js en los casos que no los especifique
# Características técnicas
* Debe tener una buena performance en un navegador
* Guarda de forma local en el navegador los puntajes
# Resultado Esperado
* Hazme las preguntas que consideres para implementar el juego, y cosas que no haya incluido en la definición inicial
* Definir el plan de implementación del juego
* Entregarme los prompt para que un asistente especializado en códificar lo ejecute

## Respuesta 2: Chat GPT
🔍 Preguntas Clave Antes de Implementar
Antes de pasar a un plan detallado, estas son preguntas necesarias que debemos resolver:

🎮 Juego y Jugabilidad
1. Movimiento enemigo: ¿deben aparecer todos los enemigos de la oleada a la vez, o uno cada cierto tiempo?
2. Daño enemigo: ¿el enemigo ataca automáticamente al estar en rango, o necesita un “turno” o intervalo entre ataques?
3. Colisiones: cuando presionas espacio para atacar, ¿haces daño a todos los enemigos en la misma columna, o solo al más cercano?
4. Buffs: ¿pueden acumularse varios buffs a la vez?
5. Jefes: ¿tienen alguna mecánica especial (p.ej., disparar, moverse más rápido) o se comportan igual que enemigos normales?
6. Sprites e imágenes: ¿quieres placeholders (colores) para la primera versión o imágenes reales de ejemplo?
7. Responsive: ¿debe escalar para móviles o nos enfocamos en escritorio?
8. Velocidad del juego: ¿prefieres que se base en requestAnimationFrame (fluido) o timers fijos (más simple)?
9. Puntajes: ¿nombre del jugador en cada partida, o se asocia al personaje seleccionado?
10. ¿Quieres sonido? (efecto de ataque, victoria, derrota)

Si me respondes estas preguntas, afinamos aún más el plan.


## Prompt 3: Chat GPT
La respuesta a tus preguntas son estas:
1. Los enemigos deben aparecer uno cada cierto tiempo, este tiempo será 1 por segundo.
2. El intervalor de ataque es el que definimos como [enemy_speed_value], el comportamiento esperado, es que al aparecer un enemigo, espera el tiempo de su velocidad, y debe determinar si moverse una casilla o atacar, esto dependerá si está en rango o no.
3. Al apretar espacio, se hace daño solo al enemigo más cercano, si hubiera 2 enemigos en la misma posición, que elija a cualquiera de ellos, por lo que podría darse un un ataque golpee a uno y el siguiente golpee al otro, eso no sería problema.
4. Si, los buffs pueden acumularse, y su efecto es permanente
5. Los jefes tienen la diferencia que tienen un rango de ataque mayor y que tienen más puntos de salud que un enemigo normal, fuera de eso no hay diferencia
6. Iniciemos con placeholders inicialmente, despues los cambiaremos por las imágenes definitivas.
7. Que sea responsive, y se escale en móviles
8. Para la velocidad usar timers, la base serían 1 segundo cada tick
9. Nombre del jugador en cada partida
10. Si sería bueno incluir sonidos ante los eventos que indicas.

# Respuesta 3: Chat GPT
Entregó el plan de implementación y los prompt para lograrlo

## Prompt 4: Copilot VSC
Crea index.html con Bootstrap 5 y las siguientes vistas en divs:

1. Menú principal (id="pantalla-menu"):
   - Botón iniciar juego nuevo
   - Botón ver puntajes

2. Pantalla selección personaje (id="pantalla-seleccion"):
   - Selector personaje (por ahora dropdown)
   - Campo nombre
   - Botón iniciar juego

3. Pantalla juego (id="pantalla-juego"):
   - Contenedor tablero 5x15
   - Indicador salud jugador
   - Indicador puntaje
   - Indicador oleada

4. Pantalla puntajes (id="pantalla-puntajes"):
   - Tabla Top 10
   - Botón volver al menú

Incluye links a Bootstrap, style.css, actions.js, values.js.

## Prompt 5: Copilot VSC
En actions.js:
- Crea una función initTablero() que genere el tablero 5 columnas x 15 filas como divs o grid.
- Cada celda con id="celda-x-y".
- Inicializa la posición del jugador en la fila 14, columna 2 (centro).

## Prompt 6: Copilot VSC
En actions.js:
- Crea listeners para:
   - Flecha izquierda: mover columna -1 (mínimo 0).
   - Flecha derecha: mover columna +1 (máximo 4).
   - Espacio: atacar enemigo más cercano en la misma columna.

## Prompt 7: Copilot VSC
En actions.js:
- Crea funciones:
   - generarOleada(oleadaNumero): genera enemigos y buffs según reglas.
   - tickJuego(): ejecutado cada segundo:
       - Mueve enemigos.
       - Realiza ataques enemigos.
       - Mueve buffs.
       - Verifica condiciones de final de oleada o juego.
- Usa setInterval para tickJuego.

## Prompt 8: Copilot VSC
En actions.js:
- Crea funciones:
   - cargarPuntajes(): obtiene top 10 de localStorage.
   - guardarPuntaje(nombre, score): inserta puntaje ordenado.
   - mostrarPuntajes(): muestra tabla.

## Prompt 9: Copilot VSC
Integra sonidos usando new Audio():
- Sonido ataque jugador.
- Sonido ataque enemigo.
- Sonido eliminar enemigo.
- Sonido recoger buff.
- Sonido game over.

## Prompt 10: Copilot VSC
En style.css:
- Haz que el tablero sea responsive.
- Usa colores de fondo azul (jugador) y rojo (enemigos).
- Buffs de color verde.

## Prompt 11: Copilot VSC
He intentado probar el juego y me genera este error:
values.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUND

## Prompt 12: Copilot VSC
El juego al cargar la pagina, está iniciando el evento de Oleada Completada. Generando una nueva oleada, cada vez, aún cuando el juego no ha iniciado. Además los botones de Iniciar Juego y Ver Puntaje del menu inicial tampoco estan funcionando al parecer

## Prompt 13: Copilot VSC
Estás mezclando script de javascript en el archivo html, te pedí que esto se mantega separado del archivo html, corrige eso

## Prompt 14: Copilot VSC
> Incluye screenshot del tablero actual
El tablero está mal, debería tener una disposición vertical, actualmente tiene una disposición horizontal. Ajusta eso

## Prompt 15: Copilot VSC
> Incluye screenshot del tablero actual
Okey, ahora si quedó bien la distribución del tablero, sin embargo están pasando varias cosas que no deberían:
* Los buff no están cayendo, se quedan estáticos en la posición donde aparecen.
* El puntaje, salud y oleadas no están siendo actualizadas a la vista del jugador, aunque parece ser que si funcionan internamente de forma correcta, solo sería la interfaz de usuario la que faltaría actualizar.
* Las columnas verticales están muy separadas, sería ideal que la distancia fuera la misma que la distancia entre las filas

## Prompt 16: Copilot VSC
El comportamiento de los enemigos no es el esperado, te indico cada caso:
1. Son eliminados con solo 1 ataque, lo esperado es que sean eliminados con 3 ataques, el valor 3 debe ser definido en values.js
2. Los enemigos al ser eliminados no aumentan el puntaje del jugador. Deberían aumentar el puntaje del jugador en 1, el valor 1 debe ser definido en values.js
3. Mostrar sobre cada enemigo la cantidad de puntos de salud que le quedan. Actualmente no muestra los puntos de salud que tiene un enemigo
El comportamiento de los buff no es el esperado, te indico cada caso:
1. Habíamos definidos 2 buffs de momentos, los cuales no sé como distinguirlos visualmente cual es, de momento agrega un texto según el tipo de buff que sea HP si es un buff de puntos de salud y ATK si es un buff de daño
2. Al ser recibidos por el personaje, está dandole 10 de puntaje, esto no debería ocurrir, el puntaje solo aumenta desde los enemigos

## Prompt 17: Copilot VSC
Hay situaciones que deben corregirse:
1. Los buffs se están reseteando junto con el reinicio de cada oleada, esto no debería pasar, los buffs deberían seguir cayendo, solo desaparecen cuando llegan a la fila más baja.
2. El personaje, al moverse queda como una "sombra" en la casilla en donde estaba, pareciera que ese estuviera vinculado a los ticks del juego, en ese sentido, el personaje no está afectado por los tick del juego
3. Los enemigos están llegando a la fila 14, y deberían quedarse en la fila 13 y atacar desde ahí, de modo que la fila del jugador nunca quedaría cubierta por enemigos.
4. La condición de termino del juego no se está cumpliendo, puedo acumular vida negativa sin fin
5. Agrega el poder de daño del jugar en la patanlla, ya que aunque parece estar funcionando, no puedo verlo en la ventana y no me queda seguridad si los buff de daño están funcionando

## Prompt 18: Copilot VSC
> Se agrega pantallazo del tablero en la condición indicada
Cuando un enemigo está en rango de ataque, este solo le quita puntos de salud al jugador, cuando el jugador se para en la misma columna que el enemigo, esto no es lo esperado, el enemigo debería poder hacer daño, siempre que se encuentre en el rango de ataque a nivel de filas, indiferentemente de la columna en que el enemigo o el jugador se encuentren.

## Prompt 19: Copilot VSC
El comportamiento de los buffs no es el esperado
* Actualmente cuando todos los enemigos de la oleada son eliminados, los buffs que siguen cayendo desaparecen
* Se espera que los buffs se mantengan, aun si la oleada es vuelta a generar. Los buffs solo desaparecen al llegar al fila inferior. La aparición y eliminación de enemigos y buff no está vinculada
* Los buffs deben generarse de forma aleatoria, máximo 2 veces por nivel y siempre deben aparece en la fila superior del tablero

## Prompt 20: Copilot VSC
Cuando el jugador pierde, el comportamiento no es el esperado:
1. La condición de puntos de salud del personaje se está cumpliendo, eso no hay que cambiarlo
2. Parece que no está revisando los puntajes actuales, ya que no me dice si quedé dentro del ranking de puntajes
3. Al terminar la partida, no hay forma de volver al menu inicial, por lo que es necesario agregar un botón que me lleve al menu inicial

## Prompt 21: 
La revisión de puntajes no se está haciendo correctamente.
* El mensaje en caso de haber quedado no debe decir que ingrese su nombre, ya que el nombre se lo pedimos antes de iniciar la * partida
* Luego de terminar una partida, la ventana de ver puntajes sigue saliendo vacía
Los puntajes deben guardarse en el navegador, de modo que si el usuario refresca (F5) los puntajes hechos no se pierdan

## Prompt 22:
Implementar mecanica de enemigo jefe:
* Este aparecerá en cada ronda que sea multiplo de 10
* En las oleadas de jefe, solo parecen jefes y no enemigos normales
* La cantidad de jefes que aparecen en cada oleada la división del número de la oleada entre 10, de modo que en la oleada 10 saldrá un jefe, en la oleada 20 saldran 2 y así sucesivamente
* Los jefes tienen 20 de puntos de salud, a diferencia de los enemigos normales
* Los jefes tienen un rango de 3 filas, es decir cuando lleguen a la fila 11 ya pueden atacar y dejarán de acercarse al jugador
* Los jefes realizan 20 de daño
* Los valores asociados al enemigo jefe, debe quedar establecido en el archivo values.js, al igual que los valores para enemigos normales que ya usamos.
* Dar una alerta especial cuando llegue una oleada de jefe, en la que los tick del juego deben hacer una pausa de 3 segundos, antes de continuar
* Para la etapa inicial, un enemigo jefe tendrá un color rojo un poco más oscuro, para diferenciarlo de los enemigos normales visualmente