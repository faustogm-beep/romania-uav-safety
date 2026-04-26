# 🇷🇴 UAV Safety Guide Romania

Professional, open-source, multi-language real-time map and safety guide for drone pilots in Romania. 

[Explore the App](https://faustogm-beep.github.io/romania-uav-safety/) (Coming soon via GitHub Pages)

---

## 🇪🇸 Descripción en Español
Esta aplicación es una guía de seguridad diseñada para pilotos de drones que vuelan en Rumanía. Proporciona una visualización clara y dinámica tanto de las zonas restringidas permanentes como de las restricciones temporales (NOTAMs) en tiempo real, obtenidas directamente de **ROMATSA**.

### Características principales:
- **Mapa en tiempo real**: Datos estáticos y NOTAMs dinámicos actualizados vía GeoServer.
- **Lista de Control Pre-vuelo**: Checklist interactivo para garantizar un vuelo seguro.
- **Geolocalización**: Ubicación del piloto en el mapa para verificar restricciones cercanas.
- **Multilenguaje**: Soporte nativo para Español e Inglés.
- **Diseño Premium**: Interfaz moderna optimizada para dispositivos móviles (PWA).

---

## 🇬🇧 English Description
This application is a safety guide designed for drone pilots flying in Romania. It provides a clear and dynamic visualization of both permanent restricted zones and real-time temporary restrictions (NOTAMs), sourced directly from **ROMATSA**.

### Key Features:
- **Real-time Map**: Static data and dynamic NOTAMs updated via GeoServer.
- **Pre-flight Checklist**: Interactive checklist to ensure safe operation.
- **Geolocation**: Pilot location on the map to verify nearby restrictions.
- **Multi-language**: Native support for Spanish and English.
- **Premium Design**: Modern interface optimized for mobile devices (PWA).

---

## 🛠️ Tech Stack & Architecture
- **Engine**: [Leaflet.js](https://leafletjs.com/) for mapping.
- **Styling**: Vanilla CSS with Glassmorphism and CSS variables.
- **Logic**: Vanilla JavaScript with native i18n implementation.
- **Data Sources**: 
  - Static: `uav_zones.json` (Local copy for speed).
  - Dynamic: ROMATSA WFS Geoserver for live NOTAMs.

---

## ⚠️ Legal Disclaimer / Descargo de Responsabilidad
**Please Read / Por favor, lea:**

**English**: This application is for informational purposes only. It is NOT an official flight planning tool. Pilots are solely responsible for ensuring they comply with all local laws and regulations. Always cross-check with the official [ROMATSA Drones portal](https://flightplan.romatsa.ro/init/drones).

**Español**: Esta aplicación es solo para fines informativos. NO es una herramienta oficial de planificación de vuelo. Los pilotos son los únicos responsables de asegurar que cumplen con todas las leyes y regulaciones locales. Siempre verifique la información en el [portal oficial de Drones de ROMATSA](https://flightplan.romatsa.ro/init/drones).

---

## 🚀 Installation & Deployment
1. Clone the repository.
2. Serve the directory using a local web server (e.g., `python -m http.server`).
3. To deploy online, simply push to a GitHub repository and enable **GitHub Pages**.

## 📝 License
This project is licensed under the **MIT License**. Feel free to use, modify and share!
