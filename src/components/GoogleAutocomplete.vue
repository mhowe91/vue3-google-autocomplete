<template>
  <input
    ref="origin"
    type="text"
    :class="class"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'

const emit = defineEmits(['update:modelValue', 'set'])
const props = defineProps({
  apiKey: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: ''
  },
  fields: {
    type: Array,
    default: () => [
      'place_id',
      'formatted_address',
      'address_components',
      'geometry',
      'name',
      'rating',
      'reviews',
      'formatted_phone_number',
      'user_ratings_total',
      'website',
    ],
  },
  isFullPayload: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  types: {
    type: Array,
    default: () => [],
  }
})

const origin = ref<any>();
const place = ref<any>()
const isLoaded = ref(false)

const loadApi = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
    } else {
      if (!isLoaded.value) {
        isLoaded.value = true
        const gScript = document.createElement("script");
        gScript.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places&v=weekly&callback=initMap`
        );

        (window as any).initMap = () => {
          resolve()
        }

        gScript.onerror = async (err) => {
          reject(err);
        }

        document.head.appendChild(gScript);
      }
    }
  })
}

const setPlacesListener = () => {
  if (origin.value) {
    const places = google.maps.places
    const autocompleteInstance = new places.Autocomplete(origin.value, {
      fields: props.fields,
      types: props.types,
      strictBounds: false
    })

    autocompleteInstance.addListener('place_changed', async () => {
      place.value = await autocompleteInstance.getPlace()
      const latitude = await place.value.geometry.location.lat()
      const longitude = await place.value.geometry.location.lng()
      let city = ''
      let state = ''
      let country = ''
      for (const component of place.value?.address_components) {
        if (component.types.includes('locality')) {
          city = await component.long_name
        } else if (component.types.includes('administrative_area_level_1')) {
          state = await component.long_name
        } else if (component.types.includes('country')) {
          country = await component.long_name
        }
      }
      const payload: Object = {
        name: place.value?.name,
        city: city,
        state: state,
        country: country,
        latitude: latitude,
        longitude: longitude,
        rating: place.value.rating || null,
        reviews: place.value.reviews || [],
        phone_number: place.value.formatted_phone_number || '',
        international_phone_number: place.value.international_phone_number || '',
        website: place.value.website || '',
        opening_hours: place.value.opening_hours || null,
        secondary_opening_hours: place.value.secondary_opening_hours || null,
        address: place.value.formatted_address || '',
        adr_address: place.value.adr_address || '',
        photos: place.value.photos || [],
        price_level: place.value.price_level || null,
        user_ratings_total: place.value.user_ratings_total || null,
        url: place.value.url || '',
        business_status: place.value.business_status || null,
        curbside_pickup: place.value.curbside_pickup || false,
        delivery: place.value.delivery || false,
        dine_in: place.value.dine_in || false,
        editorial_summary: place.value.editorial_summary?.overview || '',
        wheelchair_accessible_entrance: place.value.wheelchair_accessible_entrance || false,
        icon: place.value.icon || '',
        icon_background_color: place.value.icon_background_color || '',
        icon_mask_base_uri: place.value.icon_mask_base_uri || '',
        place_id: place.value.place_id || '',
        types: place.value.types || [],
        vicinity: place.value.vicinity || '',
        serves_beer: place.value.serves_beer || false,
        serves_breakfast: place.value.serves_breakfast || false,
        serves_brunch: place.value.serves_brunch || false,
        serves_dinner: place.value.serves_dinner || false,
        serves_lunch: place.value.serves_lunch || false,
        serves_vegetarian_food: place.value.serves_vegetarian_food || false,
        serves_wine: place.value.serves_wine || false,
        takeout: place.value.takeout || false,
        reservable: place.value.reservable || false,
        plus_code: place.value.plus_code?.global_code || '',
        utc_offset: place.value.utc_offset || null,
      }
      emit('update:modelValue', place.value?.name)
      if (props.isFullPayload)
        emit('set', place.value)
      else
        emit('set', payload)
    })
  }
}

onMounted(async () => {
  try {
    await loadApi()
    await nextTick()
    setPlacesListener()
  } catch (error) {
    console.error("Failed to load Google Maps API", error);
  }
})

onBeforeUnmount(() => {
  delete (window as any).initMap;
});
</script>
