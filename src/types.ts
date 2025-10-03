export interface Settings {
    mapTitle: string;
    mapDescription: string;
    defaultZoom: string; // Dropdown returns string
    mapHeight: string; // Dropdown returns string
    showAssetCount: boolean;
}

export interface MetadataField {
    key: string;
    value: string;
}

export interface FrontifyAsset {
    id: string;
    title: string;
    previewUrl?: string;
    metadataValues: MetadataField[];
}

export interface AssetWithLocation extends FrontifyAsset {
    latitude: number;
    longitude: number;
}

export interface FrontifyAssetsResponse {
    data: {
        assets: {
            items: FrontifyAsset[];
            total: number;
        };
    };
}