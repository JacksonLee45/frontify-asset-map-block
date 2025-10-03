import {
    AssetChooserObjectType,
    AssetChooserProjectType,
    AssetInputMode,
    defineSettings,
} from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'assetUpload',
            type: 'assetInput',
            multiSelection: false,
            mode: AssetInputMode.BrowseOnly,
            projectTypes: [AssetChooserProjectType.MediaLibrary, AssetChooserProjectType.Workspace],
            objectTypes: [AssetChooserObjectType.ImageVideo],
            size: 'large',
        },
        {
            id: 'colorInput',
            type: 'colorInput',
            clearable: true,
        },
    ],
    style: [],
});
