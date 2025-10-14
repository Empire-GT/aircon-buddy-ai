# Google Maps Integration Setup

This document explains how to set up Google Maps integration for the booking system.

## Prerequisites

1. A Google Cloud Platform account
2. A project with the Maps JavaScript API enabled

## Setup Steps

### 1. Enable Google Maps JavaScript API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Maps JavaScript API"
5. Click on it and press "Enable"

### 2. Create an API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to your domain for security

### 3. Configure Environment Variables

Create a `.env` file in your project root and add:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you created in step 2.

### 4. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

The Google Maps integration provides:

- **Interactive Map**: Click to select service location
- **Address Autocomplete**: Automatic address filling when clicking on map
- **Coordinate Storage**: Saves precise coordinates for technician navigation
- **Fallback Support**: Shows placeholder when API key is not configured

## Security Notes

- Never commit your `.env` file to version control
- Consider restricting your API key to specific domains
- Monitor your API usage in the Google Cloud Console

## Troubleshooting

### Map Not Loading
- Check if the API key is correctly set in `.env`
- Verify the Maps JavaScript API is enabled
- Check browser console for error messages

### API Key Errors
- Ensure the API key has the correct permissions
- Check if billing is enabled for your Google Cloud project
- Verify the API key restrictions (if any)

## Fallback Behavior

If the Google Maps API key is not configured or there's an error loading the map, the system will show a placeholder with instructions for manual address entry. The booking process will continue to work normally.
