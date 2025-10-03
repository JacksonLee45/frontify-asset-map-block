import type { FrontifyAssetsResponse, FrontifyAsset, AssetWithLocation } from './types';

const ASSETS_QUERY = `
  query GetAssets($limit: Int!, $page: Int!) {
    assets(limit: $limit, page: $page) {
      total
      items {
        id
        title
        previewUrl
        metadataValues {
          key
          value
        }
      }
    }
  }
`;

export class FrontifyService {
    private domain: string;
    private token: string;
    private latKey: string;
    private lonKey: string;

    constructor() {
        // Read from environment variables
        this.domain = import.meta.env.VITE_FRONTIFY_DOMAIN || '';
        this.token = import.meta.env.VITE_FRONTIFY_BEARER_TOKEN || '';
        this.latKey = import.meta.env.VITE_LATITUDE_KEY || 'latitude';
        this.lonKey = import.meta.env.VITE_LONGITUDE_KEY || 'longitude';

        if (!this.domain || !this.token) {
            console.error('Missing Frontify configuration. Please check your .env file.');
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
                    query: ASSETS_QUERY,
                    variables: {
                        limit,
                        page,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: FrontifyAssetsResponse = await response.json();

            if (!result.data?.assets?.items) {
                throw new Error('Invalid response structure from Frontify API');
            }

            return result.data.assets.items;
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
        return assets
            .map((asset) => {
                const latField = asset.metadataValues.find((m) => m.key === this.latKey);
                const lonField = asset.metadataValues.find((m) => m.key === this.lonKey);

                if (!latField || !lonField) {
                    return null;
                }

                const latitude = parseFloat(latField.value);
                const longitude = parseFloat(lonField.value);

                if (isNaN(latitude) || isNaN(longitude)) {
                    return null;
                }

                // Validate coordinate ranges
                if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
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
}