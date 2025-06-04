import { defineComponent as A, ref as d, onMounted as P, nextTick as C, onBeforeUnmount as M, openBlock as S, createElementBlock as x, normalizeClass as F } from "vue";
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
    const r = h, a = t, u = d(), e = d(), p = d(!1), B = () => new Promise((l, o) => {
      if (window.google && window.google.maps && window.google.maps.places)
        l();
      else if (!p.value) {
        p.value = !0;
        const n = document.createElement("script");
        n.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${a.apiKey}&libraries=places&v=weekly&callback=initMap`
        ), window.initMap = () => {
          l();
        }, n.onerror = async (s) => {
          o(s);
        }, document.head.appendChild(n);
      }
    }), k = () => {
      if (u.value) {
        const l = google.maps.places, o = {
          fields: a.fields,
          types: a.types,
          strictBounds: a.strictBounds
        };
        if (a.locationBias) {
          if (a.locationBias.center) {
            const s = new google.maps.LatLng(
              a.locationBias.center.lat,
              a.locationBias.center.lng
            );
            a.radius ? o.locationBias = {
              center: s,
              radius: a.radius
            } : o.locationBias = s;
          } else if (a.locationBias.bounds) {
            const s = new google.maps.LatLngBounds(
              new google.maps.LatLng(a.locationBias.bounds.south, a.locationBias.bounds.west),
              new google.maps.LatLng(a.locationBias.bounds.north, a.locationBias.bounds.east)
            );
            o.locationBias = s;
          }
        } else
          a.radius && navigator.geolocation && navigator.geolocation.getCurrentPosition(
            (s) => {
              const c = new google.maps.LatLng(
                s.coords.latitude,
                s.coords.longitude
              );
              o.locationBias = {
                center: c,
                radius: a.radius
              };
            },
            (s) => {
              console.warn("Could not get user location for radius-based filtering:", s);
            }
          );
        const n = new l.Autocomplete(u.value, o);
        n.addListener("place_changed", async () => {
          var f, m, y, b, w;
          e.value = await n.getPlace();
          const s = await e.value.geometry.location.lat(), c = await e.value.geometry.location.lng();
          let _ = "", v = "", g = "";
          for (const i of (f = e.value) == null ? void 0 : f.address_components)
            i.types.includes("locality") ? _ = await i.long_name : i.types.includes("administrative_area_level_1") ? v = await i.long_name : i.types.includes("country") && (g = await i.long_name);
          const L = {
            name: (m = e.value) == null ? void 0 : m.name,
            city: _,
            state: v,
            country: g,
            latitude: s,
            longitude: c,
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
          r("update:modelValue", (w = e.value) == null ? void 0 : w.name), a.isFullPayload ? r("set", e.value) : r("set", L);
        });
      }
    };
    return P(async () => {
      try {
        await B(), await C(), k();
      } catch (l) {
        console.error("Failed to load Google Maps API", l);
      }
    }), M(() => {
      delete window.initMap;
    }), (l, o) => (S(), x("input", {
      ref_key: "origin",
      ref: u,
      type: "text",
      class: F(t.class),
      placeholder: t.placeholder
    }, null, 10, G));
  }
});
export {
  j as GoogleAutocomplete
};
