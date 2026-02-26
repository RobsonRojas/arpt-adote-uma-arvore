import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getClassColor, convertUtmToLatLng } from '../utils/treeUtils';
import { croquiPointsUTM } from '../data/inventoryData';

const croquiPolygon = croquiPointsUTM.map(p => convertUtmToLatLng(p.easting, p.northing));

const MapComponent = ({ trees, onSelectTree, userMode, showCroqui }) => {
    const mapRef = useRef(null);
    const croquiLayer = useRef(null);
    useEffect(() => {
        if (!mapRef.current) {
            const center = trees[0] ? [trees[0].lat, trees[0].lng] : [0, 0];
            const map = L.map('map-container').setView(center, 17);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png').addTo(map);
            mapRef.current = map;
        }
        if (showCroqui) {
            if (!croquiLayer.current) {
                croquiLayer.current = L.polygon(croquiPolygon, { color: '#FFEB3B', weight: 2, fillOpacity: 0.1, dashArray: '5, 5' }).addTo(mapRef.current);
                mapRef.current.fitBounds(croquiLayer.current.getBounds(), { padding: [50, 50] });
            }
        } else if (croquiLayer.current) {
            mapRef.current.removeLayer(croquiLayer.current);
            croquiLayer.current = null;
        }
        mapRef.current.eachLayer((layer) => { if (layer instanceof L.CircleMarker) mapRef.current.removeLayer(layer); });
        trees.forEach(tree => {
            const marker = L.circleMarker([tree.lat, tree.lng], { color: getClassColor(tree.class), radius: 8, fillOpacity: 0.8 }).addTo(mapRef.current);
            marker.on('click', () => onSelectTree(tree));
        });
    }, [trees, userMode, showCroqui]);
    return <div id="map-container" style={{ height: '100%', width: '100%' }}></div>;
};

export default MapComponent;
