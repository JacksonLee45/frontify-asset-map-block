import { type FC, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { AssetWithLocation } from './types';
import type { AppBridgeBlock } from '@frontify/app-bridge';

// Fix for default marker icons in Leaflet with webpack
import 'leaflet/dist/leaflet.css';

// Create a custom icon
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface AssetMapProps {
    assets: AssetWithLocation[];
    defaultZoom: number;
    mapHeight: number;
    appBridge: AppBridgeBlock;
}

export const AssetMap: FC<AssetMapProps> = ({ assets, defaultZoom, mapHeight, appBridge }) => {
    const [center, setCenter] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (assets.length > 0) {
            // Calculate center based on all assets
            const avgLat = assets.reduce((sum, a) => sum + a.latitude, 0) / assets.length;
            const avgLon = assets.reduce((sum, a) => sum + a.longitude, 0) / assets.length;
            setCenter([avgLat, avgLon]);
        }
    }, [assets]);

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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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