# Frontify Asset Location Map

A custom content block for Frontify that displays media library assets with geographic metadata on an interactive map. Transform lengthy asset searches into quick visual discovery experiences.

## Overview

The Asset Location Map integrates with Frontify's GraphQL API to fetch assets containing latitude and longitude custom metadata fields, displaying them as interactive markers on OpenStreetMap. Users can click markers to view asset previews and details, making it easy to discover geographically-tagged media assets.

## Features

- **Interactive Map Display**: Uses Leaflet and OpenStreetMap for smooth, responsive map interactions
- **Dynamic Asset Markers**: Automatically fetches and displays assets with geographic metadata
- **Asset Previews**: Click markers to view asset thumbnails, titles, and metadata
- **Multiple Map Themes**: Choose from light (Positron), dark (Dark Matter), or standard OpenStreetMap styles
- **Automatic Centering**: Map automatically centers on asset locations with appropriate zoom levels
- **Theme-Aware Styling**: Marker colors adapt dynamically to match the selected map theme

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Frontify instance with custom metadata fields configured for latitude and longitude
- Frontify App Bridge access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontify-asset-location-map
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```env
VITE_FRONTIFY_BEARER_TOKEN=your_bearer_token_here
VITE_FRONTIFY_DOMAIN=your_domain.frontify.com
```

4. Start the development server:
```bash
npm run dev
```

## Configuration

### Environment Variables

- `VITE_FRONTIFY_BEARER_TOKEN`: Your Frontify API bearer token (required)
- `VITE_FRONTIFY_DOMAIN`: Your Frontify instance domain (required)

### Custom Metadata Fields

The map expects assets to have the following custom metadata fields:

- **Latitude**: A decimal number field (e.g., `latitude`)
- **Longitude**: A decimal number field (e.g., `longitude`)

Ensure these fields are configured in your Frontify project's custom metadata settings.

### Block Settings

Once installed in Frontify, the block provides the following configuration options:

- **Map Theme**: Choose between light, dark, or standard map styles
- **Custom Metadata Field Names**: Configure which metadata fields contain latitude/longitude data

## Usage

1. Add the Asset Location Map block to any Frontify page
2. Configure your custom metadata field names in the block settings
3. The map will automatically fetch and display all assets with valid geographic coordinates
4. Click on any marker to view the asset preview and details
5. Use standard map controls to zoom and pan

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Leaflet**: Interactive map library
- **React Leaflet**: React components for Leaflet
- **Frontify App Bridge**: Integration with Frontify platform
- **GraphQL**: API communication with Frontify
- **Vite**: Build tool and development server

## Development

### Project Structure

```
├── src/
│   ├── components/
│   │   └── AssetLocationMap.tsx    # Main map component
│   ├── settings.ts                  # Block configuration settings
│   ├── index.tsx                    # Entry point
│   └── types/                       # TypeScript type definitions
├── .env                             # Environment variables
├── vite.config.ts                   # Vite configuration
└── package.json                     # Dependencies
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to Frontify.

## Demo Script

**Business Value Hook (15 seconds)**
"Imagine you're looking for photos from a specific store location. Instead of spending 30 minutes searching through hundreds of assets, you find it in 30 seconds with a single glance at a map."

**Visual Impact (30 seconds)**
- Show the map with clustered assets
- Click a marker in a specific region
- Demonstrate the asset preview popup

**Flexibility (20 seconds)**
- Switch between light and dark map themes
- Show how the map adapts to different visual contexts

**Scalability (15 seconds)**
- Highlight how this works with any number of assets
- Mention automatic updates as new assets are tagged

**Close (10 seconds)**
"Geographic asset discovery that transforms your workflow."

## Troubleshooting

### Assets Not Appearing

- Verify assets have valid latitude/longitude values in custom metadata
- Check that custom metadata field names match your configuration
- Ensure your bearer token has proper permissions

### Map Not Centering

- Confirm at least one asset has valid coordinates
- Check browser console for any GraphQL errors

### Marker Colors Not Changing

- Ensure the latest version is deployed
- Try clearing browser cache

## Contributing

Contributions are welcome! Please ensure your code follows the existing TypeScript and React patterns.

## License

[Your License Here]

## Support

For issues or questions, contact your Frontify administrator or refer to the [Frontify Developer Documentation](https://developer.frontify.com).