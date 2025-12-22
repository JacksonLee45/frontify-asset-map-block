import { useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useState, type FC } from 'react';
import { AssetMap } from './AssetMap';
import { FrontifyService } from './frontifyService';
import type { Settings, AssetWithLocation } from './types';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const [assets, setAssets] = useState<AssetWithLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAssets = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('=== FRONTIFY ASSET MAP DEBUG INFO ===');
                console.log('Environment variables:', {
                    domain: import.meta.env.VITE_FRONTIFY_DOMAIN,
                    hasToken: !!import.meta.env.VITE_FRONTIFY_BEARER_TOKEN,
                    libraryId: import.meta.env.VITE_LIBRARY_ID,
                    latKey: import.meta.env.VITE_LATITUDE_KEY,
                    lonKey: import.meta.env.VITE_LONGITUDE_KEY,
                });

                const service = new FrontifyService();
                const metadataKeys = service.getMetadataKeys();
                
                console.log('Service initialized with library ID:', service.getLibraryId());
                console.log('Looking for metadata keys:', metadataKeys);

                // Fetch all assets
                console.log('Fetching assets from Frontify...');
                const allAssets = await service.fetchAllAssets();
                console.log(`Fetched ${allAssets.length} total assets from library`);

                // Log first few assets to see their structure
                if (allAssets && allAssets.length > 0) {
                    console.log('Sample asset structure:', {
                        id: allAssets[0].id,
                        title: allAssets[0].title,
                        hasPreviewUrl: !!allAssets[0].previewUrl,
                        customMetadata: allAssets[0].customMetadata,
                    });
                    
                    // Check what metadata property names exist across all assets
                    const allMetadataKeys = new Set<string>();
                    allAssets.forEach(asset => {
                        if (asset && asset.customMetadata && Array.isArray(asset.customMetadata)) {
                            asset.customMetadata.forEach(m => {
                                if (m && m.property && m.property.name) {
                                    allMetadataKeys.add(m.property.name);
                                }
                            });
                        }
                    });
                    console.log('All custom metadata property names found in assets:', Array.from(allMetadataKeys));
                } else {
                    console.log('No assets returned or assets is empty/undefined:', allAssets);
                }

                // Extract assets with valid location metadata
                const assetsWithLocation = service.extractAssetsWithLocation(allAssets);
                console.log(`Found ${assetsWithLocation.length} assets with valid location data`);

                if (assetsWithLocation.length > 0) {
                    console.log('Sample asset with location:', {
                        title: assetsWithLocation[0].title,
                        latitude: assetsWithLocation[0].latitude,
                        longitude: assetsWithLocation[0].longitude,
                    });
                }

                setAssets(assetsWithLocation);

                if (assetsWithLocation.length === 0 && allAssets.length > 0) {
                    setError(
                        `Found ${allAssets.length} total assets, but none have valid location metadata. ` +
                        `Make sure your assets have "${metadataKeys.latitude}" and ` +
                        `"${metadataKeys.longitude}" custom metadata fields configured in Frontify. ` +
                        `Check the browser console for a list of available metadata keys.`
                    );
                } else if (allAssets.length === 0) {
                    setError(
                        `No assets found in the specified library (ID: ${service.getLibraryId()}). ` +
                        `Please verify the library ID is correct and contains assets.`
                    );
                }

                console.log('=== END DEBUG INFO ===');
            } catch (err) {
                console.error('Error loading assets:', err);
                setError(
                    err instanceof Error
                        ? `Failed to load assets: ${err.message}`
                        : 'Failed to load assets from Frontify. Please check your environment configuration.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadAssets();
    }, []); // Only run once on mount

    return (
        <div className="tw-p-6">
            {loading && (
                <div 
                    className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gray-50 tw-rounded-lg"
                    style={{ height: `${parseInt(blockSettings.mapHeight) || 600}px` }}
                >
                    <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-blue-600 tw-mb-4"></div>
                    <p className="tw-text-gray-600">Loading assets from Frontify...</p>
                </div>
            )}

            {error && (
                <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-4 tw-mb-6">
                    <h3 className="tw-text-red-800 tw-font-semibold tw-mb-2">Error</h3>
                    <p className="tw-text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && assets.length > 0 && (
                <AssetMap 
                    assets={assets} 
                    defaultZoom={parseInt(blockSettings.defaultZoom) || 2}
                    mapHeight={parseInt(blockSettings.mapHeight) || 600}
                    mapStyle={blockSettings.mapStyle}
                    appBridge={appBridge}
                />
            )}

            {!loading && !error && assets.length === 0 && (
                <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-6">
                    <h3 className="tw-text-blue-800 tw-font-semibold tw-mb-2">No Assets Found</h3>
                    <p className="tw-text-blue-600 tw-mb-4">
                        No assets with location metadata were found in your Frontify library.
                    </p>
                    <div className="tw-text-sm tw-text-blue-700">
                        <p className="tw-font-semibold tw-mb-2">To add location data to your assets:</p>
                        <ol className="tw-list-decimal tw-list-inside tw-space-y-1">
                            <li>Go to your Frontify Media Library</li>
                            <li>Select an asset</li>
                            <li>Add custom metadata fields for latitude and longitude</li>
                            <li>Enter valid coordinates (e.g., 40.7128 for latitude, -74.0060 for longitude)</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};