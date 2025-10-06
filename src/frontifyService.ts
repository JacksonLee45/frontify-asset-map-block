import type { FrontifyAssetsResponse, FrontifyAsset, AssetWithLocation } from './types';

// Query for assets within a specific library using customMetadata
const LIBRARY_ASSETS_QUERY = `
  query GetLibraryAssets($id: ID!, $limit: Int!, $page: Int!) {
    library(id: $id) {
      assets(limit: $limit, page: $page) {
        total
        items {
          id
          title
          customMetadata {
            property {
              id
              name
            }
            ... on CustomMetadataValue {
              value
            }
            ... on CustomMetadataValues {
              values
            }
          }
          ... on Image {
            previewUrl
          }
          ... on Video {
            previewUrl
          }
          ... on Audio {
            previewUrl
          }
          ... on Document {
            previewUrl
          }
          ... on File {
            previewUrl
          }
        }
      }
    }
  }
`;

export class FrontifyService {
    private domain: string;
    private token: string;
    private libraryId: string;
    private latKey: string;
    private lonKey: string;

    constructor() {
        // Read from environment variables
        this.domain = import.meta.env.VITE_FRONTIFY_DOMAIN || '';
        this.token = import.meta.env.VITE_FRONTIFY_BEARER_TOKEN || '';
        this.libraryId = import.meta.env.VITE_LIBRARY_ID || '';
        this.latKey = import.meta.env.VITE_LATITUDE_KEY || 'latitude';
        this.lonKey = import.meta.env.VITE_LONGITUDE_KEY || 'longitude';

        // Validate required configuration
        if (!this.domain) {
            throw new Error('VITE_FRONTIFY_DOMAIN is required in .env file');
        }
        if (!this.token) {
            throw new Error('VITE_FRONTIFY_BEARER_TOKEN is required in .env file');
        }
        if (!this.libraryId) {
            throw new Error('VITE_LIBRARY_ID is required in .env file');
        }
    }

    private getGraphQLEndpoint(): string {
        return `https://${this.domain}/graphql`;
    }

    async fetchAssets(page = 1, limit = 100): Promise<FrontifyAsset[]> {
        try {
            const response = await fetch(this.getGraphQLEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify({
                    query: LIBRARY_ASSETS_QUERY,
                    variables: {
                        id: this.libraryId,
                        limit,
                        page,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Check for GraphQL errors
            if (result.errors) {
                const errorMessage = result.errors.map((e: any) => e.message).join(', ');
                throw new Error(`GraphQL error: ${errorMessage}`);
            }

            if (!result.data?.library?.assets?.items) {
                throw new Error('Invalid response structure from Frontify API. Check your library ID.');
            }

            return result.data.library.assets.items;
        } catch (error) {
            console.error('Error fetching assets from Frontify:', error);
            throw error;
        }
    }

    async fetchAllAssets(): Promise<FrontifyAsset[]> {
        const allAssets: FrontifyAsset[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            try {
                const assets = await this.fetchAssets(page, 100);
                
                if (assets.length === 0) {
                    hasMore = false;
                } else {
                    allAssets.push(...assets);
                    page++;
                    
                    // Safety limit to prevent infinite loops
                    if (page > 100) {
                        console.warn('Reached maximum page limit (10,000 assets)');
                        hasMore = false;
                    }
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                hasMore = false;
            }
        }

        return allAssets;
    }

    extractAssetsWithLocation(assets: FrontifyAsset[]): AssetWithLocation[] {
        // Guard against undefined or null assets
        if (!assets || !Array.isArray(assets)) {
            console.error('extractAssetsWithLocation received invalid assets:', assets);
            return [];
        }

        return assets
            .map((asset) => {
                // Check if customMetadata exists and is an array with items
                if (!asset.customMetadata || !Array.isArray(asset.customMetadata) || asset.customMetadata.length === 0) {
                    return null;
                }

                // Find latitude and longitude in customMetadata
                let latitude: number | null = null;
                let longitude: number | null = null;

                for (const metadata of asset.customMetadata) {
                    const propertyName = metadata.property?.name?.toLowerCase();
                    
                    if (!propertyName) continue;

                    // Get the value - could be in 'value' or 'values' field
                    let metadataValue: string | null = null;
                    
                    if ('value' in metadata && metadata.value) {
                        metadataValue = String(metadata.value);
                    } else if ('values' in metadata && metadata.values && metadata.values.length > 0) {
                        metadataValue = String(metadata.values[0]);
                    }

                    if (!metadataValue) continue;

                    // Check if this is latitude
                    if (propertyName === this.latKey.toLowerCase() || 
                        propertyName.includes('lat')) {
                        latitude = parseFloat(metadataValue);
                    }

                    // Check if this is longitude
                    if (propertyName === this.lonKey.toLowerCase() || 
                        propertyName.includes('lon') || 
                        propertyName.includes('lng')) {
                        longitude = parseFloat(metadataValue);
                    }
                }

                // Validate we found both coordinates
                if (latitude === null || longitude === null) {
                    return null;
                }

                // Validate they're valid numbers
                if (isNaN(latitude) || isNaN(longitude)) {
                    return null;
                }

                // Validate coordinate ranges
                if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                    console.warn(`Invalid coordinates for asset ${asset.title}: lat=${latitude}, lon=${longitude}`);
                    return null;
                }

                return {
                    ...asset,
                    latitude,
                    longitude,
                };
            })
            .filter((asset): asset is AssetWithLocation => asset !== null);
    }

    getMetadataKeys() {
        return {
            latitude: this.latKey,
            longitude: this.lonKey,
        };
    }

    getLibraryId() {
        return this.libraryId;
    }
}