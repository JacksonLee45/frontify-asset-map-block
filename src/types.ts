export interface Settings {
    mapTitle: string;
    mapDescription: string;
    defaultZoom: string; // Dropdown returns string
    mapHeight: string; // Dropdown returns string
    showAssetCount: boolean;
}

export interface CustomMetadataProperty {
    id: string;
    name?: string;
}

export interface CustomMetadataValue {
    property: CustomMetadataProperty;
    value?: string;
}

export interface CustomMetadataValues {
    property: CustomMetadataProperty;
    values?: string[];
}

export type CustomMetadata = CustomMetadataValue | CustomMetadataValues;

export interface FrontifyAsset {
    id: string;
    title: string;
    previewUrl?: string;
    detailUrl?: string;
    customMetadata?: CustomMetadata[];
}

export interface AssetWithLocation extends FrontifyAsset {
    latitude: number;
    longitude: number;
}

export interface FrontifyAssetsResponse {
    data: {
        library: {
            assets: {
                items: FrontifyAsset[];
                total: number;
            };
        };
    };
}