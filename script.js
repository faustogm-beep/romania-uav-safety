const I18N = {
    en: {
        status_ok: "Clear to Fly",
        status_ok_sub: "Always maintain visual line of sight.",
        status_warn: "Caution Required",
        status_warn_sub: "Active NOTAMs in this area.",
        status_rest: "Flight Restricted",
        status_rest_sub: "Check local regulations for permits.",
        status_loading: "Analyzing airspace...",
        search_placeholder: "Search zone or ID...",
        checklist_title: "Pre-Flight Checklist",
        disclaimer_short: "Disclaimer: For information only. Always check official sources.",
        checklist: [
            "Registration (ID) visible on aircraft",
            "Battery fully charged & healthy",
            "Propellers in good condition",
            "Signal/Remote test successful",
            "Airspace checked for NOTAMs",
            "Privacy respected (no crowds)"
        ],
        details_limit_low: "Lower Limit",
        details_limit_up: "Upper Limit",
        details_status: "Status",
        details_contact: "Contact",
        details_notam_from: "Valid From (UTC)",
        details_notam_to: "Valid To (UTC)",
        details_message: "Message"
    },
    es: {
        status_ok: "Espacio Despejado",
        status_ok_sub: "Mantén siempre contacto visual.",
        status_warn: "Precaución",
        status_warn_sub: "NOTAMs activos en esta zona.",
        status_rest: "Vuelo Restringido",
        status_rest_sub: "Consulta permisos locales obligatorios.",
        status_loading: "Analizando espacio aéreo...",
        search_placeholder: "Buscar zona o ID...",
        checklist_title: "Lista de Control Pre-Vuelo",
        disclaimer_short: "Aviso: Solo para información. Consulta fuentes oficiales.",
        checklist: [
            "Identificación visible en el dron",
            "Baterías cargadas y en buen estado",
            "Hélices revisadas (sin daños)",
            "Prueba de señal y mando correcta",
            "Espacio aéreo verificado (NOTAMs)",
            "Privacidad respetada (sin grupos)"
        ],
        details_limit_low: "Límite Inferior",
        details_limit_up: "Límite Superior",
        details_status: "Estado",
        details_contact: "Contacto",
        details_notam_from: "Válido desde (UTC)",
        details_notam_to: "Válido hasta (UTC)",
        details_message: "Mensaje"
    }
};

let currentLang = localStorage.getItem('uav_lang') || 'es';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n
    updateLanguageUI();

    // Map Initialization
    const map = L.map('map', { zoomControl: false }).setView([45.9432, 24.9668], 7);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM & CARTO'
    }).addTo(map);

    let uavData = { static: [], dynamic: [] };
    let geoLayer = null;
    let userMarker = null;

    // Load Data
    const staticUrl = 'uav_zones.json';
    const dynamicUrl = 'https://flightplan.romatsa.ro/init/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=carto%3Arestrictii_notam_pt_uav&maxFeatures=5000&outputFormat=application%2Fjson';

    Promise.all([
        fetch(staticUrl).then(r => r.json()),
        fetch(dynamicUrl).then(r => r.json()).catch(() => ({ features: [] }))
    ]).then(([st, dy]) => {
        uavData.static = st.features;
        uavData.dynamic = dy.features;
        renderMap();
        populateList(uavData.static.concat(uavData.dynamic));
    });

    function renderMap() {
        if (geoLayer) map.removeLayer(geoLayer);

        const stLayer = L.geoJSON({ type: "FeatureCollection", features: uavData.static }, {
            style: { fillColor: '#ff4d4d', weight: 2, color: '#ff944d', fillOpacity: 0.2 },
            onEachFeature: setupFeature
        });

        const dyLayer = L.geoJSON({ type: "FeatureCollection", features: uavData.dynamic }, {
            style: { fillColor: '#ffcc00', weight: 3, color: '#ffee00', fillOpacity: 0.4, dashArray: '5, 8' },
            onEachFeature: setupFeature
        });

        geoLayer = L.featureGroup([stLayer, dyLayer]).addTo(map);
        if (uavData.static.length > 0) map.fitBounds(stLayer.getBounds());
    }

    function setupFeature(f, l) {
        l.on('click', (e) => {
            showDetails(f.properties);
            map.fitBounds(l.getBounds(), { padding: [50, 50] });
        });
    }

    // UI Logic
    document.getElementById('lang-toggle').onclick = () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        localStorage.setItem('uav_lang', currentLang);
        updateLanguageUI();
        populateList(uavData.static.concat(uavData.dynamic));
    };

    function updateLanguageUI() {
        const t = I18N[currentLang];
        document.getElementById('current-lang').innerText = currentLang.toUpperCase();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        // Update Checklist
        const list = document.getElementById('checklist-items');
        list.innerHTML = '';
        t.checklist.forEach((item, i) => {
            const li = document.createElement('li');
            li.className = 'check-item';
            li.innerHTML = `<div class="check-box"></div><span>${item}</span>`;
            li.onclick = () => li.classList.toggle('done');
            list.appendChild(li);
        });
    }

    function populateList(features) {
        const container = document.getElementById('zone-list');
        container.innerHTML = '';
        features.forEach(f => {
            const p = f.properties;
            const name = p.notam_series ? `NOTAM ${p.notam_series}` : (p.zone_id || 'UAV Zone');
            const card = document.createElement('div');
            card.className = 'zone-card';
            card.innerHTML = `<h3>${name}</h3><div class="meta"><span>${p.lower_lim || 'SFC'} - ${p.upper_lim || 'UNL'}</span><span>${p.status || ''}</span></div>`;
            card.onclick = () => showLayerByProp(p.notam_series ? 'notam_series' : 'id', p.notam_series || p.id);
            container.appendChild(card);
        });
    }

    function showLayerByProp(key, val) {
        geoLayer.eachLayer(group => {
            group.eachLayer(layer => {
                if (layer.feature.properties[key] === val) {
                    showDetails(layer.feature.properties);
                    map.fitBounds(layer.getBounds());
                }
            });
        });
    }

    function showDetails(p) {
        const t = I18N[currentLang];
        const panel = document.getElementById('details-panel');
        const content = document.getElementById('details-content');
        const isDy = p.notam_series !== undefined;
        
        let html = `<h3>${isDy ? 'NOTAM ' + p.notam_series : (p.zone_id || 'Zone')}</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; font-size:12px;">`;
        html += `<div><b>${t.details_limit_low}</b><br>${p.lower_lim || 'SFC'}</div>`;
        html += `<div><b>${t.details_limit_up}</b><br>${p.upper_lim || 'UNL'}</div>`;
        
        if (isDy) {
            html += `<div style="grid-column:span 2"><b>${t.details_notam_from}</b><br>${p.dfrom}</div>`;
            html += `<div style="grid-column:span 2"><b>${t.details_notam_to}</b><br>${p.dto}</div>`;
            html += `<div style="grid-column:span 2"><b>${t.details_message}</b><br><i style="opacity:0.8">${p.message}</i></div>`;
        } else {
            html += `<div><b>${t.details_status}</b><br>${p.status}</div>`;
            html += `<div style="grid-column:span 2"><b>${t.details_contact}</b><br>${p.contact || 'N/A'}</div>`;
        }
        html += `</div>`;
        
        content.innerHTML = html;
        panel.classList.add('active');

        // Update Safety Status based on zone type
        updateSafetyStatus(isDy ? 'warn' : 'rest');
    }

    function updateSafetyStatus(type) {
        const t = I18N[currentLang];
        const dot = document.getElementById('status-dot');
        const card = document.getElementById('status-card');
        const title = card.querySelector('h2');
        const sub = card.querySelector('p');

        dot.className = `status-dot ${type === 'warn' ? 'yellow' : (type === 'rest' ? 'red' : 'green')}`;
        title.innerText = t[`status_${type}`];
        sub.innerText = t[`status_${type}_sub`];
    }

    // Modal Control
    document.getElementById('safety-toggle').onclick = () => document.getElementById('safety-modal').style.display = 'flex';
    document.querySelector('.close-modal').onclick = () => document.getElementById('safety-modal').style.display = 'none';
    document.querySelector('.close-details').onclick = () => document.getElementById('details-panel').classList.remove('active');

    // Geoloc
    document.getElementById('locate-me').onclick = () => {
        map.locate({setView: true, maxZoom: 14});
    };
    
    map.on('locationfound', (e) => {
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.circleMarker(e.latlng, { radius: 8, color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 0.8 }).addTo(map);
        updateSafetyStatus('ok');
    });

    // Search
    document.getElementById('zone-search').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        const all = uavData.static.concat(uavData.dynamic).filter(f => {
            const p = f.properties;
            return (p.zone_id || '').toLowerCase().includes(val) || 
                   (p.notam_series || '').toLowerCase().includes(val) ||
                   (p.message || '').toLowerCase().includes(val);
        });
        populateList(all);
    };
});
