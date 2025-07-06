# Prompt 1
```
Actua como desarrollador web full stack, para crear un video juego con la dinámica "wave survival action game"
# Características Tecnologías
* HTML
* CSS utilizar Bootstrap 5 principalmente
* Javascript sin frameworks adicionales
* Aplicación solo funciona en el cliente/navegador, no se conecta a API
* Almacena progreso en el navegador del usuario, en forma local
# Estructura del proyecto
El proyecto debe estar dentro de la carpeta wave-survival-action-AQS y mantendremos las partes separadas de la siguiente forma:
wave-survival-action-AQS/
├── index.html          # Código principal del juego
├── actions.js          # Acciones y eventos de JavaScript
├── style.css           # Estilos personalizados (complementando Bootstrap)
├── assets/             # Imagenes y recursos necesarios para el proyecto
├──── characters.png    # Imagen que contiene los sprites de los hereoes/personajes que puede elegir el jugador
├──── enemies.png       # Imagen que contiene los sprites de los enemigos en el juego
├──── buffs.jpg         # Imagen que contiene los sprites de las mejoras que tendrá el heroe
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
# Dinámicas de juego
* Personaje inicia en una sala en donde se encuentra en la parte inferior de la pantalla, los enemigos aparecerán en la parte superior
* Definir una grilla virtual (No es visible al usuario) de 5 casillas horizontales y 15 casillas verticales
* El personaje puede moverse horizontalmente en la base de la grilla, pero puede atacar a los enemigos sin importa la distancia a la que estos se encuentren, solo debe estar en la misma linea vertical para que el ataque sea efectivo.
* Todos los enemigos aparecen en la parte superior de la grilla y avanzan 1 casilla verticalmente hacia el personaje, pueden aparecer aleatoriamente en cualquiera de las 5 casillas, pero mantienen su dirección vertical.
* Los enemigos normales se acercan a una velocidad constante, solo pueden quitarle vida al personaje cuando están a una casilla de distancia horizontal del personaje
* Los enemigos jefe se acercan a una velocidad constante, solo pueden quitarle vía al persona cuando están a 3 o menos casillas de distancia horizontal del personaje, tendrán más vida que un enemigo normal
* Las oleadas tienen una cantidad a determinar de enemigos normales en las oleadas que no son divisibles por 20
* Las oleadas divisibles en 20, serán de enemigos jefe, solo saldrá uno
* Las oleadas inician en la 1, hasta lo máximo que pueda llegar el juegador, la idea es que cada oleada sea un poco más dificil que la anterior
* En cada oleadas, debe aparecerán de forma aleatoria entre 1 a 2 buffs, el cual el personaje debe tocar, para ganar el buff
* Los buff los vamos a definir un poco más adelante
* Cada enemigo al morir, le da un puntaje al jugador, el cual se guardará en el ranking de los 10 mejores si cumple con ser los más altos
* Los valores de vida/salud, ataque, velocidades y puntajes del personaje y enemigos los iremos ajustando según las pruebas que se realicen. Establece valores iniciales que consideres adecuado para este tipo de video juegos
* El juego termina cuando el personaje se quede sin salud, en el que debe determinar si el puntaje entra en el ranking de los 10 mejores, si es así, le pide su nombre y lo guarda en el ranking, finalmente vuelve a la pantalla inicial
# Características técnicas
* Debe tener una buena performance en un navegador
* Guarda de forma local en el navegador los puntajes

# Resultado Esperado
* Hazme las preguntas que consideres para implementar el juego, y cosas que no haya incluido en la definición inicial
* Definir el plan de implementación del juego
* Ejecutar el plan de implementación
```

# Prompt 2
```
Al querer revisar el juego me arroja este error en el navegador:
bootstrap.min.css:1  Failed to load resource: the server responded with a status of 404 ()
bootstrap.min.css:1  Failed to load resource: the server responded with a status of 404 ()
Corrige este error
```

# Prompt 3
```
El error que genera ahora es diferente, pero sigue sin funcionar:
index.html:1 Failed to find a valid digest in the 'integrity' attribute for resource 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' with computed SHA-384 integrity '9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'. The resource has been blocked.
Corrige este error
```

# Prompt 4
```
La aplicación inicia sin problemas, sin embargo solo se muestra menú inicial, ninguno de los dos botones genera ninguna acción, que está pasando?
```