# Farming Hub - Farmer, Consumer and Labour Platform

This version removes the dealer/middleman workflow and keeps the project focused on direct interaction between:

- Farmer
- Small Scale Consumer
- Labour

## Main Features

- Farmer crop listing with delete option
- Consumer direct buying/negotiation from farmers only
- Farmer incoming customer orders with accept/decline
- Labour availability and booking only for farmers
- Labour revoke/cancel booking option
- Farmer investment and profit tracking
- Live farm location and Google Maps redirect
- Farmer Nearby Agri Stores search
- Pesticides, seeds, soil and weather information section
- Crop Suitability Advisor using soil, humidity, rain and water source
- Karnataka farmer schemes with benefit, link, procedure and helpline
- Separate floating WhatsApp Agent icon, not merged inside chatbot
- Farming AI chatbot for screen navigation and tips
- Dark/light mode and language selector

## Live Nearby Agri Stores

The backend route is:

```txt
/api/agri-stores/nearby?lat=LATITUDE&lng=LONGITUDE
```

It first uses Google Places API if you add a key in `config.js`. If the key is empty, it uses free OpenStreetMap Overpass API fallback for demo.

## WhatsApp Agent

The backend route is:

```txt
/api/whatsapp-agent?message=YOUR_MESSAGE
```

The fixed WhatsApp number is stored only in backend `config.js`.

## Run Locally

```bash
npm install
npm start
```

Open:

```txt
http://localhost:3000
```

## Demo Logins

Password for all demo users:

```txt
123456
```

Demo emails:

```txt
farmer@agri.com
labour@agri.com
consumer@agri.com
```

## Important Config File

Open `config.js` and update:

```js
GOOGLE_PLACES_API_KEY: '',
WHATSAPP_AGENT_NUMBER: '919876543210',
DEFAULT_SEARCH_RADIUS_METERS: 7000,
DEFAULT_STORE_SEARCH_ADDRESS: 'Karnataka, India'
```

Do not put `+`, spaces or dashes in the WhatsApp number. Use country code format, for example `919876543210`.
