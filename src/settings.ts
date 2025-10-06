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
            id: 'mapStyle',
            type: 'dropdown',
            label: 'Map Style',
            defaultValue: 'light',
            choices: [
                { value: 'standard', label: 'Standard OpenStreetMap' },
                { value: 'light', label: 'Light (Minimal)' },
                { value: 'dark', label: 'Dark Theme' },
            ],
        },
        {
            id: 'defaultZoom',
            type: 'dropdown',
            label: 'Default Zoom Level',
            defaultValue: '2',
            choices: [
                { value: '1', label: '1 - World View' },
                { value: '2', label: '2 - Continental' },
                { value: '3', label: '3 - Regional' },
                { value: '4', label: '4 - Country' },
                { value: '5', label: '5 - State' },
                { value: '6', label: '6 - Province' },
                { value: '8', label: '8 - City' },
                { value: '10', label: '10 - Metro Area' },
                { value: '12', label: '12 - District' },
                { value: '14', label: '14 - Neighborhood' },
                { value: '16', label: '16 - Street' },
                { value: '18', label: '18 - Building' },
            ],
        },
        {
            id: 'mapHeight',
            type: 'dropdown',
            label: 'Map Height',
            defaultValue: '600',
            choices: [
                { value: '300', label: 'Small (300px)' },
                { value: '400', label: 'Medium Small (400px)' },
                { value: '500', label: 'Medium (500px)' },
                { value: '600', label: 'Medium Large (600px)' },
                { value: '700', label: 'Large (700px)' },
                { value: '800', label: 'Extra Large (800px)' },
                { value: '1000', label: 'Huge (1000px)' },
            ],
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