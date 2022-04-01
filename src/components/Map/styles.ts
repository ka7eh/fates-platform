const basemapSource: maplibregl.RasterSourceSpecification = {
    type: 'raster',
    tiles: ['//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution:
        'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community'
};

const basemapLayer: maplibregl.RasterLayerSpecification = {
    id: 'basemap',
    type: 'raster',
    source: 'basemap',
    minzoom: 0,
    maxzoom: 22
};

export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.LayerSpecification> } } = {
    sites: {
        default: {
            type: 'circle',
            paint: {
                'circle-radius': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    10,
                    ['boolean', ['feature-state', 'hovered'], false],
                    10,
                    7
                ],
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    '#ff0000',
                    ['boolean', ['feature-state', 'hovered'], false],
                    '#a06f35',
                    '#002e2c'
                ],
                'circle-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    0.5,
                    ['boolean', ['feature-state', 'hovered'], false],
                    0.5,
                    1
                ]
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
        basemap: basemapSource
    },
    layers: [basemapLayer]
};
