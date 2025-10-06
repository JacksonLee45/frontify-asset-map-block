export interface Settings {
    mapTitle: string;
    mapDescription: string;
    defaultZoom: string;
    mapHeight: string;
    showAssetCount: boolean;
}

export interface CustomMetadataProperty {
    id: string;
    name: string;
}

export interface CustomMetadataItem {
    property: CustomMetadataProperty;
    value?: string;
    values?: string[];
}

export interface FrontifyAsset {
    id: string;
    title: string;
    previewUrl?: string;
    customMetadata?: CustomMetadataItem[];
}

export interface AssetWithLocation extends FrontifyAsset {
    latitude: number;
    longitude: number;
}

export interface FrontifyAssetsResponse {
    data: {
        library: {
            assets: {
                total: number;
                items: FrontifyAsset[];
            };
        };
    };
}