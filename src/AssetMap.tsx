import { type FC, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { AssetWithLocation } from './types';
import type { AppBridgeBlock } from '@frontify/app-bridge';

// Fix for default marker icons in Leaflet with webpack
import 'leaflet/dist/leaflet.css';

interface AssetMapProps {
    assets: AssetWithLocation[];
    defaultZoom: number;
    mapHeight: number;
    appBridge: AppBridgeBlock;
    mapStyle?: string;
}

export const AssetMap: FC<AssetMapProps> = ({ 
    assets, 
    defaultZoom, 
    mapHeight, 
    appBridge,
    mapStyle = 'light'
}) => {
    const [center, setCenter] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (assets.length > 0) {
            // Calculate center based on all assets
            const avgLat = assets.reduce((sum, a) => sum + a.latitude, 0) / assets.length;
            const avgLon = assets.reduce((sum, a) => sum + a.longitude, 0) / assets.length;
            setCenter([avgLat, avgLon]);
        }
    }, [assets]);

    // Get tile layer configuration based on selected style
    const getTileLayer = () => {
        switch (mapStyle) {
            case 'light':
                return {
                    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                };
            case 'dark':
                return {
                    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                };
            default:
                return {
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                };
        }
    };

    // Create custom SVG marker icon
    const customIcon = new L.DivIcon({
        html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#000000"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const tileConfig = getTileLayer();

    if (assets.length === 0) {
        return (
            <div 
                className="tw-flex tw-items-center tw-justify-center tw-bg-gray-100 tw-rounded-lg"
                style={{ height: `${mapHeight}px` }}
            >
                <p className="tw-text-gray-500 tw-text-lg">
                    No assets with location metadata found
                </p>
            </div>
        );
    }

    return (
        <div 
            className="tw-w-full tw-rounded-lg tw-overflow-hidden tw-shadow-lg"
            style={{ height: `${mapHeight}px` }}
        >
            <MapContainer
                center={center}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution={tileConfig.attribution}
                    url={tileConfig.url}
                />
                {assets.map((asset) => (
                    <Marker
                        key={asset.id}
                        position={[asset.latitude, asset.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="tw-p-2">
                                <h3 className="tw-font-bold tw-mb-2">{asset.title}</h3>
                                {asset.previewUrl && (
                                    <div className="tw-mb-2">
                                        <img
                                            src={asset.previewUrl}
                                            alt={asset.title}
                                            className="tw-max-w-[200px] tw-max-h-[200px] tw-object-contain tw-rounded"
                                        />
                                    </div>
                                )}
                                <p className="tw-text-sm tw-text-gray-600">
                                    <span className="tw-font-semibold">Coordinates:</span> {asset.latitude.toFixed(6)}, {asset.longitude.toFixed(6)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};