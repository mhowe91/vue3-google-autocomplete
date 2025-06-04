import { defineComponent as A, ref as _, onMounted as P, nextTick as x, onBeforeUnmount as C, openBlock as M, createElementBlock as S, normalizeClass as F } from "vue";
const G = ["placeholder"], j = /* @__PURE__ */ A({
  __name: "GoogleAutocomplete",
  props: {
    apiKey: {
      type: String,
      required: !0
    },
    class: {
      type: String,
      default: ""
    },
    fields: {
      type: Array,
      default: () => [
        "place_id",
        "formatted_address",
        "address_components",
        "geometry",
        "name",
        "rating",
        "reviews",
        "formatted_phone_number",
        "user_ratings_total",
        "website"
      ]
    },
    isFullPayload: {
      type: Boolean,
      default: !1
    },
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    types: {
      type: Array,
      default: () => []
    },
    // Location bias options for distance-based filtering
    locationBias: {
      type: Object,
      default: null,
      validator: (t) => t ? t.center && typeof t.center.lat == "number" && typeof t.center.lng == "number" || t.bounds && t.bounds.north && t.bounds.south && t.bounds.east && t.bounds.west : !0
    },
    // Radius in meters for circular location bias
    radius: {
      type: Number,
      default: null,
      validator: (t) => t === null || t > 0 && t <= 5e4
    },
    // Strict bounds - if true, only return results within the specified area
    strictBounds: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "set"],
  setup(t, { emit: h }) {
    const c = h, a = t, d = _(), e = _(), g = _(!1), B = () => new Promise((n, s) => {
      if (window.google && window.google.maps && window.google.maps.places)
        n();
      else if (!g.value) {
        g.value = !0;
        const l = document.createElement("script");
        l.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${a.apiKey}&libraries=places&v=weekly&callback=initMap`
        ), window.initMap = () => {
          n();
        }, l.onerror = async (o) => {
          s(o);
        }, document.head.appendChild(l);
      }
    }), k = async () => {
      if (d.value) {
        const n = google.maps.places, s = {
          fields: a.fields,
          types: a.types,
          strictBounds: a.strictBounds
        };
        if (a.locationBias) {
          if (a.locationBias.center) {
            const o = new google.maps.LatLng(
              a.locationBias.center.lat,
              a.locationBias.center.lng
            );
            a.radius ? s.locationBias = {
              center: o,
              radius: a.radius
            } : s.locationBias = o;
          } else if (a.locationBias.bounds) {
            const o = new google.maps.LatLngBounds(
              new google.maps.LatLng(a.locationBias.bounds.south, a.locationBias.bounds.west),
              new google.maps.LatLng(a.locationBias.bounds.north, a.locationBias.bounds.east)
            );
            s.locationBias = o;
          }
        } else if (a.radius && navigator.geolocation)
          try {
            const o = await new Promise((r, u) => {
              navigator.geolocation.getCurrentPosition(r, u, {
                enableHighAccuracy: !0,
                timeout: 1e4,
                maximumAge: 3e5
              });
            }), p = new google.maps.LatLng(
              o.coords.latitude,
              o.coords.longitude
            );
            s.locationBias = {
              center: p,
              radius: a.radius
            }, console.log("Location bias applied with user location:", o.coords.latitude, o.coords.longitude);
          } catch (o) {
            console.warn("Could not get user location for radius-based filtering:", o);
          }
        const l = new n.Autocomplete(d.value, s);
        l.addListener("place_changed", async () => {
          var m, f, y, b, w;
          e.value = await l.getPlace();
          const o = await e.value.geometry.location.lat(), p = await e.value.geometry.location.lng();
          let r = "", u = "", v = "";
          for (const i of (m = e.value) == null ? void 0 : m.address_components)
            i.types.includes("locality") ? r = await i.long_name : i.types.includes("administrative_area_level_1") ? u = await i.long_name : i.types.includes("country") && (v = await i.long_name);
          const L = {
            name: (f = e.value) == null ? void 0 : f.name,
            city: r,
            state: u,
            country: v,
            latitude: o,
            longitude: p,
            rating: e.value.rating || null,
            reviews: e.value.reviews || [],
            phone_number: e.value.formatted_phone_number || "",
            international_phone_number: e.value.international_phone_number || "",
            website: e.value.website || "",
            opening_hours: e.value.opening_hours || null,
            secondary_opening_hours: e.value.secondary_opening_hours || null,
            address: e.value.formatted_address || "",
            adr_address: e.value.adr_address || "",
            photos: e.value.photos || [],
            price_level: e.value.price_level || null,
            user_ratings_total: e.value.user_ratings_total || null,
            url: e.value.url || "",
            business_status: e.value.business_status || null,
            curbside_pickup: e.value.curbside_pickup || !1,
            delivery: e.value.delivery || !1,
            dine_in: e.value.dine_in || !1,
            editorial_summary: ((y = e.value.editorial_summary) == null ? void 0 : y.overview) || "",
            wheelchair_accessible_entrance: e.value.wheelchair_accessible_entrance || !1,
            icon: e.value.icon || "",
            icon_background_color: e.value.icon_background_color || "",
            icon_mask_base_uri: e.value.icon_mask_base_uri || "",
            place_id: e.value.place_id || "",
            types: e.value.types || [],
            vicinity: e.value.vicinity || "",
            serves_beer: e.value.serves_beer || !1,
            serves_breakfast: e.value.serves_breakfast || !1,
            serves_brunch: e.value.serves_brunch || !1,
            serves_dinner: e.value.serves_dinner || !1,
            serves_lunch: e.value.serves_lunch || !1,
            serves_vegetarian_food: e.value.serves_vegetarian_food || !1,
            serves_wine: e.value.serves_wine || !1,
            takeout: e.value.takeout || !1,
            reservable: e.value.reservable || !1,
            plus_code: ((b = e.value.plus_code) == null ? void 0 : b.global_code) || "",
            utc_offset: e.value.utc_offset || null
          };
          c("update:modelValue", (w = e.value) == null ? void 0 : w.name), a.isFullPayload ? c("set", e.value) : c("set", L);
        });
      }
    };
    return P(async () => {
      try {
        await B(), await x(), await k();
      } catch (n) {
        console.error("Failed to load Google Maps API", n);
      }
    }), C(() => {
      delete window.initMap;
    }), (n, s) => (M(), S("input", {
      ref_key: "origin",
      ref: d,
      type: "text",
      class: F(t.class),
      placeholder: t.placeholder
    }, null, 10, G));
  }
});
export {
  j as GoogleAutocomplete
};
