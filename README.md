# Vue3 Google Places Autocomplete Widget

This is simple google places autocomplete address widget for your use in Vu3 applications. This is basically style-less component so you can provide styling/classes as per your need.

![Demo GIF](https://i.imgur.com/lYXgEm8.gif)

## Installation

```
npm install vue3-google-autocomplete
```
or

```
yarn add vue3-google-autocomplete
```

## Usage
Here is the example on how to use it inside your Vue component.

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
  />
</template>



<script setup lang="ts">
import { ref } from 'vue'
import { GoogleAutocomplete } from 'vue3-google-autocomplete'

const value = ref()
</script>

```

Pass in types to filter your autocomplete results to your specific Google place type(s).
[Google Place Types](https://developers.google.com/maps/documentation/places/web-service/supported_types/)

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    types="['establishment']"
  />
</template>
```

Here on `@set` event you can get your google places api payload
```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    @set="getPayload($event)"
  />
</template>
```

By default you will get payload like this.

Eg.

```Javascript
{
    "name": "The White House",
    "city": "Washington",
    "state": "District of Columbia",
    "country": "United States",
    "latitude": 38.8976763,
    "longitude": -77.0365298
}
```

There is one prop `isFullPayload` which is `false` by default but if you pass `isFullPayload: true` as shown below you will get full (default) google places api payload.

Eg.

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    :isFullPayload="true"
    @set="getPayload($event)"
  />
</template>
```

## Distance-Based Filtering

You can narrow autocomplete results by distance using location bias and radius options. This is useful when you want to prioritize results near a specific location.

### Using Location Bias with Center Point and Radius

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    :location-bias="{ center: { lat: 37.7749, lng: -122.4194 } }"
    :radius="5000"
    @set="getPayload($event)"
  />
</template>
```

### Using Location Bias with Rectangular Bounds

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    :location-bias="{
      bounds: {
        north: 37.8,
        south: 37.7,
        east: -122.3,
        west: -122.5
      }
    }"
    @set="getPayload($event)"
  />
</template>
```

### Using Radius with User's Current Location

If you only provide a radius without locationBias, the component will attempt to use the user's current location (requires geolocation permission):

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    :radius="10000"
    @set="getPayload($event)"
  />
</template>
```

### Strict Bounds

By default, location bias provides preference to results within the specified area but may still return results outside it. Use `strictBounds` to only return results within the specified area:

```Javascript
<template>
  <GoogleAutocomplete
    v-model="value"
    api-key="process.env.VITE_APP_GAPI_KEY"
    :location-bias="{ center: { lat: 37.7749, lng: -122.4194 } }"
    :radius="5000"
    :strict-bounds="true"
    @set="getPayload($event)"
  />
</template>
```

### Distance Filtering Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locationBias` | Object | `null` | Location bias object with either `center` (lat/lng) or `bounds` (north/south/east/west) |
| `radius` | Number | `null` | Radius in meters for circular location bias (max 50,000m) |
| `strictBounds` | Boolean | `false` | If true, only return results within the specified area |

## Contribution

Suggestions and pull requests are welcome after discussing the issue
