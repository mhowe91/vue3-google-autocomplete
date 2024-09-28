import { defineComponent as P, ref as c, onMounted as B, nextTick as M, onBeforeUnmount as S, openBlock as x, createElementBlock as C, normalizeClass as F } from "vue";
const G = ["placeholder"], V = /* @__PURE__ */ P({
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
    }
  },
  emits: ["update:modelValue", "set"],
  setup(n, { emit: b }) {
    const r = b, o = n, i = c(), e = c(), d = c(!1), h = () => new Promise((a, s) => {
      if (window.google && window.google.maps && window.google.maps.places)
        a();
      else if (!d.value) {
        d.value = !0;
        const t = document.createElement("script");
        t.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${o.apiKey}&libraries=places&v=weekly&callback=initMap`
        ), window.initMap = () => {
          a();
        }, t.onerror = async (u) => {
          s(u);
        }, document.head.appendChild(t);
      }
    }), k = () => {
      if (i.value) {
        const a = google.maps.places, s = new a.Autocomplete(i.value, {
          fields: o.fields,
          types: o.types,
          strictBounds: !1
        });
        s.addListener("place_changed", async () => {
          var m, f, g, y, w;
          e.value = await s.getPlace();
          const t = await e.value.geometry.location.lat(), u = await e.value.geometry.location.lng();
          let _ = "", p = "", v = "";
          for (const l of (m = e.value) == null ? void 0 : m.address_components)
            l.types.includes("locality") ? _ = await l.long_name : l.types.includes("administrative_area_level_1") ? p = await l.long_name : l.types.includes("country") && (v = await l.long_name);
          const A = {
            name: (f = e.value) == null ? void 0 : f.name,
            city: _,
            state: p,
            country: v,
            latitude: t,
            longitude: u,
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
            editorial_summary: ((g = e.value.editorial_summary) == null ? void 0 : g.overview) || "",
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
            plus_code: ((y = e.value.plus_code) == null ? void 0 : y.global_code) || "",
            utc_offset: e.value.utc_offset || null
          };
          r("update:modelValue", (w = e.value) == null ? void 0 : w.name), o.isFullPayload ? r("set", e.value) : r("set", A);
        });
      }
    };
    return B(async () => {
      try {
        await h(), await M(), k();
      } catch (a) {
        console.error("Failed to load Google Maps API", a);
      }
    }), S(() => {
      delete window.initMap;
    }), (a, s) => (x(), C("input", {
      ref_key: "origin",
      ref: i,
      type: "text",
      class: F(n.class),
      placeholder: n.placeholder
    }, null, 10, G));
  }
});
export {
  V as GoogleAutocomplete
};
