
# Ensaimedia

Ensaimedia permite ver la salida de vídeo de un ZX-Uno o otra FPGA en un ordenador con USB host. Adicionalmente permite redireccionar el teclado, ratón y gamepads del host al ZX-Uno vía puerto serie. La salida de sonido del ZX-Uno también es capturada por el host si dispone de entrada de MIC o de línea de audio. La visualización se realiza desde el navegador web, ya sea en el host, o en otro dispositivo remoto. Por último, permite capturar vídeo y audio a disco.

El desarrollo de este addon ha sido posible gracias a la información y software de Wolfgang Wieser sobre el chip Cypress FX2 [en este sitio web.](https://www.triplespark.net/elec/periph/USB-FX2)

# Índice

En este README:
- [Guía de usuario](https://github.com/yomboprime/ensaimedia#guia-de-usuario-de-ensaimedia)
- [Documentación del protocolo](https://github.com/yomboprime/ensaimedia#documentaci%C3%B3n-ensaimedia)

En este repositorio:
- [Binarios de los cores](https://github.com/yomboprime/ensaimedia/tree/master/cores/)
- [Esquemático y PCB (en formato Kicad)](https://github.com/yomboprime/ensaimedia/tree/master/ensaimediaBoard)
- [Esquemático en formato PDF](https://github.com/yomboprime/ensaimedia/tree/master/ensaimediaBoard)
- [Código del servidor](https://github.com/yomboprime/ensaimedia/blob/master/server.js)
- [Código del cliente](https://github.com/yomboprime/ensaimedia/blob/master/client/src/client.js)



# Guia de usuario de Ensaimedia

## Requisitos en el ZX-Uno

Necesitas el addon de Ensaimedia para tu FPGA, así como instalar el core de Ensaimedia de tu máquina retro.

Actualmente sólo está disponible el core oficial de ZX-Uno para ZX Spectrum.

## Requisitos del software Ensaimedia del host:

El host debe ser un sistema Unix, debido a que se usa el programa [fx2pipe](https://www.triplespark.net/elec/periph/USB-FX2/software/fx2pipe.html) para la entrada de vídeo por USB. El cliente (o clientes) puede ser cualquier sistema con un navegador web moderno.

- Ejecuta lo siguiente para instalar los requisitos previos:

`sudo apt install git npm libusb-dev build-essential`

- Pon a tu usuario en el grupo dialout para poder acceder al puerto serie:

`sudo adduser <nombre_de_usuario> dialout`

(Necesitas salir de la sesión o reiniciar para aplicar la adición al grupo, pero puedes reiniciar al terminar la instalación)

## Instalación del software Ensaimedia

Ve al directorio que se desea contenga el directorio de Ensaimedia.

Ejecuta:

```
git clone https://github.com/yomboprime/ensaimedia.git
cd ensaimedia
npm install
```

Adicionalmente hay que instalar unas reglas UDEV. Para ello ejecuta lo siguiente desde el directorio de Ensaimedia:

`sudo cp ./udevrules/z70_usbfx2.rules /etc/udev/rules.d`

Despues reinicia.


## Configuración del software

Edita el fichero `EnsaimediaConfig.json` que está en la raíz de la aplicación:

Como mínimo querrás cambiar el puerto TCP en el que sirve Ensaimedia (opción `listenPort`)

La ruta del fichero del puerto serie se cambia en la opción `serialPortFilePath`.

Si vas a usar audio necesitas primero identificar el dispositivo de audio de tu tarjeta de sonido. Para ello ejecuta:

`arecord -L`

Y verás una lista de dispositivos de entrada de audio. Tendrás que ir probando hasta dar con el mejor; algunos pueden funcionar peor o tener lag.

Copia la primera línea de uno de ellos y pégala (entre comillas) en la opción "audioDevice" en el fichero de configuración.

Para las opciones de guardado a disco mira la sección "Captura a disco" de esta documentación.

## Ejecución de Ensaimedia

Para utilizar Ensaimedia sigue estos pasos:

- Enciende el host.
- Conecta la FPGA al host (ver sección correspondiente más abajo)
- Activa en la FPGA el core deseado de Ensaimedia
- Ejecuta el software de Ensaimedia en el host.

Para ejecutar Ensaimedia sirve una cualquiera de estas tres variantes (en el directorio de Ensaimedia):

- `./Ensaimedia.sh`
- `node server.js`
- `npm start`

Para terminar el programa en cualquier momento, pulsa Ctrl-c en la consola donde lo has abierto.

Al ejecutar verás algunos mensajes indicando los recursos que está abriendo el programa. Si todo va bien, al cabo de un segundo verás el mensaje "New graphic mode: XXXxYYY", que indica que se ha activado el vídeo con esa resolución.

Ahora abre desde un navegador la url: `http://<IP del host>:<puerto TCP configurado>/main.html`

Por ejemplo, si estás abriendo el navegador desde el propio host y el puerto que editaste en `EnsaimediaConfig.json` fue el 12345, abre la url:

`http://127.0.0.1:12345/main.html`

Al abrir la URL ya deberá verse la pantalla de vídeo de la retromáquina.

## Uso de Ensaimedia

El teclado, ratón y dos gamepads funcionan de forma transparente.

Para activar el sonido debes ir al menú, arriba a la derecha (las páginas HTML no permiten reproducción de sonido sin intervención del usuario)

En el menú verás algunas opciones visuales:

- `Pixelated screen`: Hace que los píxels se vean nítidos en vez de interpolados. Nota: De momento no funciona en Firefox.
- `Interlazed`: Mezcla dos fotogramas consecutivos para ver correctamente demos con entrelazado.
- `Resolution is múltiple`: Hace que la resolución de salida sea múltiplo de la nativa de la máquina. Si está desactivada entonces la pantalla se ajusta mejor al espacio disponible pero puede haber píxeles irregulares.
- `Show info on screen`: Muestra en la esquina superior izquierda información de frames por segundo, clientes conectados y audio.
- `Toggle full screen`: Cambia entre modo pantalla completa y ventana.
- `Audio enabled`: Habilita el sonido.
- `Input options`: Aqui puedes activar o desactivar el envío de eventos de teclado, ratón y gamepads.
- `Open/close Controls`: Minimiza o expande el menú.

## Captura a disco

Para activar la captura a disco, establece a `true` los valores `saveVideoToDiskEnabled` y/o `saveAudioToDiskEnabled` en el fichero de configuración `EnsaimediaConfig.json`.

La captura se realiza en el host, los clientes del navegador no pueden afectar a esta.

La captura comenzará tan pronto como haya señal de vídeo, y la sesión se guardará en una carpeta nueva bajo `Ensaimedia/savedSessions/` (con nombre dependiente de la fecha y hora) como dos ficheros: `video.bin` con el vídeo en raw, y `audio.wav` con el audio. Estos ficheros continuarán creciendo mientras esté funcionando el programa, a un ritmo aproximado de 500 MB por minuto (para el core de ZX Spectrum con vídeo y audio).

Tras finalizar la sesión de Ensaimedia hay que postprocesar los datos raw para generar un vídeo comprimido webm "píxel perfect" que se pueda reproducir. Este proceso puede tardar 10 veces lo que dura el vídeo. Para ello:

- Abre un terminal de consola en la carpeta de Ensaimedia
- Ejecuta la orden `node convertCapture.js <carpeta> ni FPS`, donde:
	- <carpeta> es el nombre de la subcarpeta bajo `savedSessions`, sin barras.
	- "ni" Significa "not interlazed". Pon `i` en su lugar si quieres que se mezclen fotogramas dos a dos para desentrelazar el vídeo (el vídeo de salida tendrá la mitad de FPS)
	- FPS son los FPS originales del vídeo, 50 para el core de  ZX Spectrum. Puede contener decimales. El valor es independiente de si seleccionas entrelazado o no.

Este proceso convierte el vídeo raw a imágenes `.png` que ocupan otro tanto, y después llama al programa `ffmpeg` para crear el vídeo webm. En todo momento se muestra el estado de la conversión.

Al terminar se habrá creado el fichero `video.webm` en la subcarpeta de la sesión. Puedes entonces borrar el resto de ficheros. Puedes volver a crear el vídeo en cualquier momento si los ficheros `video.bin` y `audio.wav` están presentes (el fichero de audio es opcional)

## Conexión del ZX-Uno al host

Hay tres conexiones por cable entre el host y la FPGA: Un cable microUSB para el vídeo, un puerto serie para periféricos y RTC, y el cable de audio analógico.

Muy importante (Sólo para ZX-Uno): No conectes el microUSB de alimentación normal del ZX-Uno mientras usas el addon de Ensaimedia. Tanto el ZX-Uno como el addon son alimentados por el cable microUSB de éste último.

### Cable MicroUSB

Este cable conecta el host a la FPGA mediante un cable microUSB con líneas de datos (hay cables que sólo sirven para cargar y no tienen los cables que transportan los datos, sólo los de alimentación)

Este cable alimenta al ZX-Uno y al addon.

Es importante que el puerto del host sea USB 2.0 o superior. No sirve USB 1.0 ó 1.1.

### Cable puerto serie

Si el host tiene puerto serie de 3.3V accesible, puedes conectarlo directamente con tres cables Dupont (los comunes de 2.54 mm de separación). Si no, necesitarás un dongle USB Serial **que tenga jumper para configurarse a 3.3V (5V no vale)** y ocupar un puerto USB más.

La conexión de los tres cables Dupont en cualquier caso es la siguiente (verás el conector en el addon indicado como "serial" y los pines "RX", "TX" y "GND":

```
RX de la FPGA <--- TX del dongle
TX de la FPGA ---> RX del dongle
GND de la FPGA --- GND del dongle
```

### Cable de audio

Es un simple cable de audio estéreo minijack macho-macho. Se conecta desde la salida de sonido de la FPGA a la entrada de mic o de línea en el host.

Puede que necesites usar alsamixer para ajustar el volumen de la entrada.


## Problemas conocidos

En el propio host y en red local (LAN) el sonido funciona bien. Sin embargo, debido a que se usa WebRTC, para usar el sonido en Ensaimedia desde dispositivos que no tienen una IP pública (o si el host no tiene IP pública) habría que usar un "TURN server". No se ha implementado aún esta posibilidad, al no existir servidores TURN de acceso público.

-------------------------------------


# Documentación Ensaimedia

Ensaimedia consiste en una interfaz de comunicación entre un ZX-Uno (o otra FPGA) y un host USB mediante USB 2.0, para transmisión de vídeo al host, además de una interfaz serie (UART) para transmitir información de periféricos desde el host al ZX-Uno. Adicionalmente el software del host permite entrada y salida de audio analógico, conectando LINE y EAR del ZX-Uno a MIC y LINE del host.

Esto permite:

- Usar la salida HDMI del host (o cualquier salida futura) como nativa del core de ZX-Uno.
- Usar periféricos USB en el host como entrada en el ZX-Uno: Teclado, ratón y gamepads.
- Virtualizar completamente el ZX-Uno y hacerlo disponible a clientes web, cada uno con sus periféricos y recepción de vídeo y audio.
- Capturar a disco la sesión de vídeo y audio.

# Interfaz física de Ensaimedia

## Interfaz de vídeo

La interfaz de vídeo en Ensaimedia 1.0 consiste en un bus síncrono en el que el ZX-Uno es el master, y un chip Cypress CY7C68013A-56PVXC (FX2LP) lee ese bus y envía los datos por USB 2.0.

El bus es de 16 bits de ancho. El máximo ancho de banda teórico del bus es 48 MHz * 2 = 96 Mbytes/s. Pero el máximo transferible por USB 2.0 es aproximadamente 42 Mbytes/s, usando el programa [fx2pipe](https://www.triplespark.net/elec/periph/USB-FX2/software/fx2pipe.html), qué solo permite transmitir en una dirección. Otros drivers/librerías permiten transferencia bidireccional pero con menos ancho de banda.

Las señales de control del bus son (out es en dirección al host, in es en dirección al ZX-Uno):

- SLCLK (out) Reloj del bus síncrono proporcionado por el core del ZX-Uno. Debe estar entre 5 y 48 MHz y ser estable.
- SLWR (out) Señal de escritura (de un word de 16 bits) al bus (El ZX-Uno escribe)
- SLRD (out) Señal de lectura desde el bus (El ZX-Uno lee) (*)
- AVAILABLE (in): Pin que indica que hay un word disponible para lectura para el ZX-Uno. (*)

(*) Esta capacidad es posible en el addon de ZX-Uno Ensaimedia 1.0, pero no es usada por el sistema Ensaimedia para la salida de vídeo. Otros cores/experimentos pueden hacer uso de ella. Para conseguir dirección de datos desde el host a la FPGA en ensaimedia 1.0 se debe cambiar el "solder jumper" J8 a GND (pin 1 de J8). Para uso de ensaimedia debe estar a 3V3 (pin 3 de J8) El pin del FX2 en concreto es ADDR1: Dirección específica del FX2LP (número de endpoint). Es decir, este bit debe valer 1 para dirección de transmisión del ZX-Uno al host, y 0 para la dirección contraria.


## Interfaz serie

La interfaz serie para periféricos entre el ZX-Uno y el host USB es una UART estándar a 3.3V y 115200 baudios, 8 bits de datos, 1 bit stop, sin paridad ni control de flujo. Se usan ambos pines RX y TX.

# Protocolo Ensaimedia

## Formato de video de Ensaimedia

El ZX-Uno transmite al host comandos completos que son palabras de 16 bits de ancho. Estos comandos especifican el formato de vídeo y transfieren los valores RGB de los píxels.

Los comandos X_RES, Y_RES, MODE, START_FRAME y PIXEL son obligatorios en cada frame.

### Comando: PIXEL

Especifica un pixel según el formato seleccionado (ver comando MODE)

Según el formato de pixel seleccionado, cada pixel pueden estar dividido en varios comandos (words) diferentes.

### Comando: START_FRAME

1000000000000000 : marca de inicio de frame. El host espera un frame completo (dos START_FRAME) antes de comenzar a procesar el vídeo y darlo como válido.

### Comando: X_RES

101XXXXXXXXXXXXX : ajustar resolucion horizontal a X + 1 (X es de 13 bits, resolución desde 1 pixel hasta 8K pixels). Aplica en el siguiente inicio de frame.

### Comando: Y_RES

110YYYYYYYYYYYYY : ajustar resolucion vertical a Y + 1 (X es de 13 bits, resolución desde 1 pixel hasta 8K pixels) Aplica en el siguiente inicio de frame.

### Comando: MODE

111xxxxxmmmmRRFF : Establecer modo de pixel, reflexión (flip) y posterior rotación.

- m:
	- 0000: modo Spectrum ZX-Uno R3G3B3.
		- Formato del comando de pixel (1 word): 16'b0000000RRRGGGBBB
	- 0001: modo R5G5B5.
		- Formato del comando de pixel (1 word): 16'b0RRRRRGGGGGBBBBB
	- 0010: modo R8G8B8.
		- Formato del comando de pixel (2 words): 16'b0000GGGGRRRRRRRR, 16'b0001GGGGBBBBBBBB.
		- El primer word contiene el nibble de mayor peso del canal G.
	- 0011: modo R8G8B8.
		- Formato del comando de pixel (3 words): 16'b00000000RRRRRRRR, 16'b00000001GGGGGGGG, 16'b00000010BBBBBBBB
	- Otros valores: No definido aún

- x: reservado para futuros usos según el valor de m.

- FF = Reflexión: 00 no reflexión, 01 reflexion horizontal, 10 vertical, 11 ambas.

- RR = Rotación: 00 normal, 01 = 90 grados sentido horario, 10 = 180 grados, 11 = 270 grados

Notas:

La rotación de la imagen se aplica después de la reflexión.

Este comando aplica en el siguiente inicio de frame.

Múltiples comandos MODE son posibles en un mismo frame, según futuros usos.


## Formato de transmisión de los periféricos de Ensaimedia

Ensaimedia puede aunar diferentes periféricos de entrada de varios usuarios online (además de los del host) en una sola interfaz serie.

Los periféricos que provee la interfaz de Ensaimedia son:

- Un teclado PS/2
- Un ratón PS/2 con tres botones (sin rueda)
- Dos joysticks digitales de cuatro direcciones y 8 botones cada uno

En el core de ZX Spectrum no están implementados, sencillamente por no haber: el tercer botón del ratón, ni el segundo joystick con sus botones. Y el primer joystick sólo tiene dos botones.

Una transmisión completa consiste en una trama desde el host al ZX-Uno, y otra trama de respuesta desde el ZX-Uno al host. Este ciclo se repite a disposición del host.

### Trama Host -> ZX-Uno:

La secuencia de bytes de la trama es:

- 0x34: Inicio de frame
- 1 byte de configuración
- 1 byte joyDir: udlrudlr JoyUp1, JoyDown1, JoyLeft1, JoyRight1, JoyUp2, JoyDown2, JoyLeft2, JoyRight2
- 1 byte joyBtn1: 8 botones del Joystick1
- 1 byte joyBtn2: 8 botones del Joystick2
- 1 byte numBytesKeyb:  Num. bytes de PS2 de teclado. Si no hay, a 0. Max 255
- 1 byte numBytesMouse:  Num. bytes de PS2 de ratón. Si no hay, a 0. Max 255
- bytes de teclado, si los hay
- bytes de ratón, si los hay
- bytes de fecha y hora. Si el Formato es 0: No hay bytes de fecha y hora. Formato 1: 16 bytes; Formato 2: 8 bytes. Formato 3: variable, terminado en el byte 0x00.

#### Byte de configuración

011000ff

- ff: Formato de fecha y hora (0 al 3) en esta trama. Otros formatos de hora diferentes al deseado por el ZX-Uno serán ignorados por éste.


Otros valores del byte son reservados.

#### Formatos de fecha y hora:

Ensaimedia implementa un módulo de tiempo real o RTC. El host envía el tiempo cada segundo, pudiéndose transmitir en varios formatos. En el core de Spectrum del ZX-Uno el módulo se traduce en la implementación de los puertos del addon RTC del DivMMC. Hay que tener en cuenta que este addon no implementa husos horarios, por lo que siempre se mostrará la hora UTC para compatibilizar la hora de los ficheros en sistemas de almacenamiento modernos. El puerto usado para el RTC en el core Spectrum es el 0xCXEF (X = don't care)

Los formatos de fecha y hora posibles son:

- Formato 0: No hay fecha y hora (valor por defecto al empezar la transmisión)

- Formato 1: Formato del chip RTC242X (addon DivMMC)

	16 bytes con los valores de los registros del chip.

	Nota: Los días de la semana del 0 al 6 empiezan en Domingo.

	Ver datasheet del chip para más información.

- Formato 2: Timestamp

	8 bytes con un entero de 64 bits sin signo (more significant byte first) con los milisegundos transcurridos desde 00:00:00 UTC del 1 de enero de 1970.

- Formato 3: Formato flexible de usuario.

	En este formato se transmite una cadena de bytes de longitud arbitraria y formato definido por el usuario, y terminada en el byte 0.

	Lo que se haga con esa cadena en el core de ZX-Uno depende del core concreto. El comportamiento por defecto es leer la cadena e ignorarla.

### Respuesta del ZX-Uno al host: byte de ack

101000ff

ff: Formato de hora deseado, 0 al 3 (para las próximas tramas)
