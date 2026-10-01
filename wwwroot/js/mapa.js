// Inicializar o mapa
const map = L.map('map', {
    center: [-14, -52],
    zoom: 4,
    zoomControl: true
});

// Adicionar camada base 
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 18
}).addTo(map);

// Adicionar camada de referência 
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri',
    maxZoom: 18
}).addTo(map);

// Definir cores para cada bioma (mais discretas)
const biomeColors = {
    'Amazônia': '#0d5016',
    'Cerrado': '#d4a017',
    'Caatinga': '#ff6b35',
    'Mata Atlântica': '#4169e1',
    'Pantanal': '#8b4513',
    'Pampa': '#32cd32'
};

// Dados dos biomas brasileiros com coordenadas mais precisas
const biomesData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Amazônia",
                "desmatamento": "78%",
                "area_km2": 5500000,
                "descricao": "Maior floresta tropical do mundo"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-73.98, 5.27],
                    [-60.11, 5.27],
                    [-49.95, 2.82],
                    [-44.30, -2.33],
                    [-48.63, -16.34],
                    [-57.30, -18.04],
                    [-67.81, -11.87],
                    [-70.09, -9.19],
                    [-73.98, -7.36],
                    [-73.98, 5.27]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Cerrado",
                "desmatamento": "45%",
                "area_km2": 2036448,
                "descricao": "Savana tropical com grande biodiversidade"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-57.30, -18.04],
                    [-48.63, -16.34],
                    [-44.30, -2.33],
                    [-42.54, -2.33],
                    [-35.24, -14.24],
                    [-35.24, -20.30],
                    [-46.63, -24.53],
                    [-52.43, -24.53],
                    [-57.30, -18.04]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Caatinga",
                "desmatamento": "15%",
                "area_km2": 844453,
                "descricao": "Vegetação seca adaptada ao semiárido"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-42.54, -2.33],
                    [-35.24, -2.33],
                    [-34.80, -17.34],
                    [-42.54, -17.34],
                    [-42.54, -2.33]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Mata Atlântica",
                "desmatamento": "32%",
                "area_km2": 1110182,
                "descricao": "Floresta costeira altamente ameaçada"
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [
                    [[
                        [-35.00, -5.50],
                        [-34.80, -5.50],
                        [-34.80, -17.50],
                        [-35.00, -17.50],
                        [-35.00, -5.50]
                    ]],
                    [[
                        [-48.50, -19.00],
                        [-40.00, -19.00],
                        [-40.00, -33.75],
                        [-51.00, -33.75],
                        [-51.00, -23.00],
                        [-48.50, -19.00]
                    ]],
                    [[
                        [-38.50, -12.50],
                        [-34.80, -12.50],
                        [-34.80, -18.00],
                        [-38.50, -18.00],
                        [-38.50, -12.50]
                    ]]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Pantanal",
                "desmatamento": "12%",
                "area_km2": 150355,
                "descricao": "Maior planície alagada do mundo"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-59.18, -14.24],
                    [-55.67, -14.24],
                    [-55.67, -22.27],
                    [-59.18, -22.27],
                    [-59.18, -14.24]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Pampa",
                "desmatamento": "25%",
                "area_km2": 176496,
                "descricao": "Campos nativos do Sul do Brasil"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-57.65, -28.18],
                    [-49.70, -28.18],
                    [-49.70, -33.75],
                    [-57.65, -33.75],
                    [-57.65, -28.18]
                ]]
            }
        }
    ]
};

// Variáveis para armazenar as camadas
let biomesLayer = null;
let affectedAreasLayer = null;
let statesLayer = null;

// Função para estilizar biomas (estilo mais discreto e uniforme)
function styleBiome(feature) {
    return {
        fillColor: biomeColors[feature.properties.name] || '#666666',
        weight: 1,
        opacity: 0,
        color: '#333333',
        fillOpacity: 0
    };
}

// Função para adicionar eventos aos biomas (sem hover highlighting)
function onEachBiome(feature, layer) {
    // Apenas clique para zoom, sem efeitos de hover
    layer.on({
        click: function (e) {
            map.fitBounds(e.target.getBounds());
        }
    });

    // Adicionar popup com informações
    const popupContent = `
    <div style="font-family: Arial, sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: ${biomeColors[feature.properties.name]};">
            🌿 ${feature.properties.name}
        </h3>
        <p><strong>📏 Área Total:</strong> ${feature.properties.area_km2.toLocaleString()} km²</p>
        <p><strong>🚨 Desmatamento:</strong> ${feature.properties.desmatamento}</p>
        <p><strong>ℹ️ Descrição:</strong> ${feature.properties.descricao}</p>
    </div>
    `;
    layer.bindPopup(popupContent);
}

// Adicionar biomas ao mapa
biomesLayer = L.geoJSON(biomesData, {
    style: styleBiome,
    onEachFeature: onEachBiome
}).addTo(map);

// Carregar dados de áreas afetadas
fetch('/meuarquivo4.json')
    .then(res => {
        if (!res.ok) {
            throw new Error('Arquivo meuarquivo4.json não encontrado');
        }
        return res.json();
    })
    .then(data => {
        affectedAreasLayer = L.geoJSON(data, {
            style: {
                color: 'red',
                weight: 2,
                fillColor: 'red',
                fillOpacity: 0.5
            }
        }).addTo(map);
    })
    .catch(error => {
        console.log('Não foi possível carregar áreas afetadas:', error);
    });

// Carregar dados dos estados
fetch('estados.json')
    .then(res => {
        if (!res.ok) {
            throw new Error('Arquivo estados.json não encontrado');
        }
        return res.json();
    })
    .then(data => {
        statesLayer = L.geoJSON(data, {
            style: {
                color: 'blue',
                weight: 1,
                fillOpacity: 0
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties.name) {
                    layer.bindTooltip(feature.properties.name, {
                        permanent: true,
                        direction: 'center',
                        className: 'state-label'
                    });
                }
            }
        }).addTo(map);
    })
    .catch(error => {
        console.log('Não foi possível carregar estados:', error);
    });

// Adicionar interatividade aos itens da sidebar
document.querySelectorAll('.biome-item').forEach(item => {
    item.addEventListener('click', function () {
        const biomeName = this.querySelector('.biome-name').textContent;

        // Encontrar e destacar o bioma no mapa
        if (biomesLayer) {
            biomesLayer.eachLayer(function (layer) {
                if (layer.feature.properties.name === biomeName) {
                    map.fitBounds(layer.getBounds());
                    layer.openPopup();
                }
            });
        }
    });
});

// Remover loading quando o mapa estiver pronto
map.whenReady(function () {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);
});

// Controle de camadas
const overlays = {};
if (biomesLayer) overlays["Biomas"] = biomesLayer;
if (affectedAreasLayer) overlays["Áreas Afetadas"] = affectedAreasLayer;
if (statesLayer) overlays["Estados"] = statesLayer;

L.control.layers(null, overlays).addTo(map);

// Adicionar escala
L.control.scale().addTo(map)