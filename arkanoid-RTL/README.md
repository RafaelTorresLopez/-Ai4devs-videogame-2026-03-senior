# Videojuego  | ES

He elegido la implementación de un Arkanoid básico.
Lo he desarrollado utilizando Cursor, que hasta ahora no lo había utilizado.

Lo más destacable ha sido que quería que todo se ejecutase desde local y las primeras compilaciones generaban problemas por CORS, tras dos PROMPTS adicionales, se ha resuelto el problema y todo se puede ejecutar desde Dist.

# Ejecutable

Probad el index.html directamente desde dist


## PROMPT_01

Eres un experto desarrollador de videojuegos.

Examina la estructura inicial del proyecto, ya que el desarrollo del juego deberá visualizarse en un navegador.

Tu tarea inicial será configurar y mejorar la estructura inicial para desarrollar una copia ligera del juego Arkanoid.

No quiero escribir ninguna línea de código, por lo que el desarrollo lo realizarás completamente.

Dime qué información adicional necesitas para desarrollar este juego.


### PREGUNTAS DE LA IA AL PROMPT_01

Información adicional que me ayudará a terminar el juego
Con valores por defecto ya se puede hacer un Arkanoid “clásico”, pero si quieres que encaje con tu idea, conviene aclarar:

1) Controles: ¿solo teclado, ratón, o ambos? ¿Velocidad de la pala “arcade” o más lenta?
2) Reglas: ¿Vidas (cuántas)? ¿Niveles con más filas / ladrillos duros que requieran dos golpes? ¿Power-ups (agrandar pala, pegar pelota, multibola) sí o no para esta primera versión “ligera”?
3) Puntuación y fin de partida: ¿Tabla local (solo en esta sesión) o persistencia en localStorage?
4) Pantalla: ¿Mantener 640×480 lógicos con escalado, u otra proporción (p. ej. 16:9 móvil)?
5) Estética: ¿Pixel art con assets en public/assets, o formas vectoriales en canvas (como ahora) sin imágenes externas?
6) Audio: ¿Sin sonido, efectos simples (Web Audio / archivos en public), o lo dejamos para una segunda fase?
7) Accesibilidad / idioma: ¿Textos y mensajes solo en español?
Cuando quieras, el siguiente paso es implementar física de la pelota, colisiones, destrucción de ladrillos, pérdida de vida y reinicio sobre esta base, sin que tú tengas que escribir código.

### RESPUESTAS SOBRE LAS PREGUNTAS DE LA IA AL PROMPT_01

1) Ambos controles y velocidad de pala arcade. 
2) Reglas tres vidas, el resto sencillo sin complicaciones. 
3) Puntuación sin persistencia. 
4) 640x480 
5) Sin imagenes externas. 
6) Sin audio 
7) sólo español. 

## PROMPT_02

Ahora para mejorar la jugabilidad vamos a añadir audios, quiero sonidos de efectos simples para: 
1) Golpeo de la pala a la pelota. 
2) Golpeo de la pelota con las paredes 
3) Golpeo de la pelota en los ladrillos.  

El juego tendrá niveles infinitos y según avance el nivel éste se complicará, al incorporar ladrillos que necesiten más de un golpe para destruirse y/o la bola irá más rápido en los siguientes niveles.


## PROMPT_03

Si ejecuto el index.html del dist no me está funcionando, por qué?


## PROMPT_04

index.html:1 Access to script at 'file:///C:/Users/tecnoabi/Projects/arkanoid-lite/dist/assets/index-DmJKEcjZ.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.Understand this error
index-DmJKEcjZ.js:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
index.html:1 Access to CSS stylesheet at 'file:///C:/Users/tecnoabi/Projects/arkanoid-lite/dist/assets/index-Bv4EdNHC.css' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.Understand this error
index-Bv4EdNHC.css:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
index.html:1 Unsafe attempt to load URL file:///C:/Users/tecnoabi/Projects/arkanoid-lite/dist/index.html from frame with URL file:///C:/Users/tecnoabi/Projects/arkanoid-lite/dist/index.html. 'file:' URLs are treated as unique security origins.


