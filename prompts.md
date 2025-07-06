# Iniciando a realizar metaprompting para aterrizar las ideas
Vamos a iniciar utilizando Chat GPT (free plan) en el navegador
## Prompt 1:
Quiero hacer un juego, pero desconozco cual es el nombre que ayudaría para que un asistente de código pueda ayudarme a crearlo más facilmente:
El juego consiste en que vienen olas de mob/enemigos y entre medio aparecen cosas que te van dando bonificaciones para que tu personaje pueda pegar más fuerte, se mueva más rapido, entre otras mejoras que pudieran existir, cada cierta cantidad de rondas, aparecería un enemigo que debes derrotar, y así continuar hasta que se te acabe la vida.
Como se llaman este tipo de juegos?

## Prompt 2:
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