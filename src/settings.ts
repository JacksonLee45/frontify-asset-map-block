import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'mapTitle',
            type: 'input',
            label: 'Map Title',
            placeholder: 'Asset Location Map',
            defaultValue: 'Frontify Asset Map',
        },
        {
            id: 'mapDescription',
            type: 'input',
            label: 'Map Description',
            placeholder: 'Explore your Frontify assets on an interactive map',
            defaultValue: 'Explore your Frontify assets on an interactive map',
        },
        {
            id: 'defaultZoom',
            type: 'slider',
            label: 'Default Zoom Level',
            defaultValue: 2,
            min: 1,
            max: 18,
            step: 1,
        },
        {
            id: 'mapHeight',
            type: 'slider',
            label: 'Map Height (pixels)',
            defaultValue: 600,
            min: 300,
            max: 1200,
            step: 50,
        },
        {
            id: 'showAssetCount',
            type: 'switch',
            label: 'Show Asset Count',
            defaultValue: true,
        },
    ],
    style: [],
});
