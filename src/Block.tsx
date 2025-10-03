import {
    type Asset,
    useBlockSettings,
    useBlockAssets,
    rgbObjectToRgbString,
    useColorPalettes,
} from '@frontify/app-bridge';
import { SegmentedControl } from '@frontify/fondue-components';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useState, type FC } from 'react';

import ColorSwatch from './ColorSwatch';

type TransformMode = 'none' | 'remove-bg' | 'achro' | 'flip';

interface Settings {
    colorInput: { red: number; green: number; blue: number; alpha: number };
}

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const { colorPalettes } = useColorPalettes(appBridge);
    const [blockAsset, setBlockAsset] = useState<Asset | null>(null);
    const { blockAssets } = useBlockAssets(appBridge);
    const [mode, setMode] = useState<TransformMode>('none');
    const getTransformedUrl = (url: string | null, m: TransformMode) => {
        if (!url) {
            return null;
        }
        // Remove any width={width} placeholder (all occurrences, ?width={width} or &width={width})
        let cleaned = url.replaceAll(/([&?])?width={width}/g, '');
        // Collapse double ampersands (use replace with global regex for compatibility)
        cleaned = cleaned.replaceAll('&&', '&');
        // Ensure no trailing ? or &
        cleaned = cleaned.replace(/[&?]$/, '');
        // Always start with mod=v1
        const sep = cleaned.includes('?') ? '' : '?';
        let finalUrl = `${cleaned}${sep}mod=v1`;
        // Append transform using "/" as separator
        switch (m) {
            case 'remove-bg':
                finalUrl += '/background=remove';
                break;
            case 'achro':
                finalUrl += '/achro';
                break;
            case 'flip':
                finalUrl += '/flip=both';
                break;
            case 'none':
            default:
                break;
        }
        return finalUrl;
    };
    const transformedUrl = getTransformedUrl(blockAsset?.previewUrl ?? null, mode);

    useEffect(() => {
        const uploadedAsset = blockAssets.assetUpload?.[0];
        if (uploadedAsset) {
            setBlockAsset(uploadedAsset);
        }
    }, [blockAssets]);

    console.log(blockSettings);
    console.log(colorPalettes);

    return (
        <div className="tw-p-6">
            <h2
                className="tw-text-2xl tw-font-bold tw-mb-4 tw-p-4 tw-rounded-lg"
                style={{ backgroundColor: rgbObjectToRgbString(blockSettings.colorInput) }}
            >
                Color Palette Explorer
            </h2>

            {transformedUrl && (
                <div className="tw-mb-6">
                    <SegmentedControl.Root
                        defaultValue="none"
                        value={mode}
                        onValueChange={(v) => setMode(v as TransformMode)}
                    >
                        <SegmentedControl.Item value="none">none</SegmentedControl.Item>
                        <SegmentedControl.Item value="remove-bg">Remove BG</SegmentedControl.Item>
                        <SegmentedControl.Item value="achro">achro</SegmentedControl.Item>
                        <SegmentedControl.Item value="flip">flip</SegmentedControl.Item>
                    </SegmentedControl.Root>
                    {transformedUrl}
                    <img src={transformedUrl} alt="Uploaded asset" className="tw-max-w-md tw-rounded-lg tw-shadow-md" />
                </div>
            )}

            {colorPalettes && colorPalettes.length > 0 ? (
                <div className="tw-space-y-8">
                    {colorPalettes.map((palette) => (
                        <div key={palette.id} className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-6">
                            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">{palette.name}</h3>

                            <div className="tw-flex tw-flex-wrap tw-gap-4">
                                {palette.colors.map((color) => (
                                    <div key={color.id} className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                                        <ColorSwatch color={rgbObjectToRgbString(color)} />
                                        {color.name && (
                                            <span className="tw-text-sm tw-text-gray-600 tw-text-center tw-max-w-[80px] tw-truncate">
                                                {color.name}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="tw-text-gray-500 tw-italic">No color palettes available</p>
            )}
        </div>
    );
};
