# Neo WiFi 🛜

**Neo WiFi** es una aplicación móvil que, al abrirla, te dice al instante cuáles son las tres antenas WiFi públicas más cercanas a donde estás parado. Sin buscar nada, sin escribir nada: solo abrís la app y ella hace el resto.

---

## ¿Qué problema resuelve?

Encontrar WiFi pública disponible cerca tuyo puede ser una tarea frustrante. Neo WiFi elimina esa fricción: compara tu posición GPS contra una base de datos de **5 080 antenas** y calcula con precisión geodésica (fórmula de Haversine) cuáles son las más próximas, mostrándote el resultado en segundos.

---

## ¿Qué podés hacer con Neo WiFi?

### 📶 Encontrar WiFi cercana al instante
La pantalla principal muestra las **tres antenas más cercanas** ordenadas por distancia. De cada una ves su nombre, el tipo de antena, la cantidad de usuarios que soporta y la distancia exacta desde donde estás. Todo actualizado en tiempo real a medida que te movés.

### 🗺️ Ver las antenas en el mapa
Un mapa interactivo marca tu posición y la ubicación de cada antena, unidas por líneas que te dan una idea visual inmediata de qué tan lejos están. Podés hacer zoom y explorar la zona como si fuera cualquier mapa que conocés.

### ✈️ Saber qué aeropuerto tenés cerca
Además de las antenas WiFi, la app identifica el **aeropuerto más cercano** a tu ubicación, útil para orientarte geográficamente o planificar desplazamientos.

### 📤 Compartir tu ubicación o los datos de una antena
Con un toque podés enviar por WhatsApp, correo o cualquier otra app:
- Tu posición actual con las antenas cercanas.
- Los datos específicos de una antena (nombre, distancia, tipo, MAC, coordenadas).

### 🎵 Reproductor de música local
Neo WiFi incluye un reproductor de archivos MP3 almacenados en el dispositivo, con lista de canciones, barra de progreso interactiva, controles de reproducción y diseño inspirado en los reproductores modernos.

### 🌗 Se adapta a tu preferencia visual
La interfaz respeta el tema del sistema: **modo oscuro o claro** de forma automática, sin configuración manual.

---

## ¿Cómo funciona por dentro?

Neo WiFi combina dos fuentes de información:

1. **Base de datos local** — un dataset de 5 080 antenas WiFi embebido en la app. No necesita internet para calcular distancias.
2. **API propia** — un servicio propio desarrollado en Node.js que, dado tu GPS, devuelve la ciudad, provincia, país y las antenas más cercanas con todos sus metadatos.

La distancia a cada antena se calcula con la **fórmula de Haversine**, que tiene en cuenta la curvatura de la Tierra para dar un resultado métrico real, no una aproximación plana.

---

## Licencia

Uso personal / educativo. Los datos de antenas WiFi pertenecen a sus respectivas fuentes públicas.
