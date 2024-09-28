import { defineComponent as A, ref as p, onMounted as P, nextTick as B, onBeforeUnmount as M, openBlock as S, createElementBlock as x, normalizeClass as b } from "vue";
const C = ["placeholder"], G = /* @__PURE__ */ A({
  __name: "GoogleAutocomplete",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    apiKey: {
      type: String,
      required: !0
    },
    placeholder: {
      type: String,
      default: ""
    },
    types: {
      type: Array,
      default: () => []
    },
    isFullPayload: {
      type: Boolean,
      default: !1
    },
    class: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "set"],
  setup(n, { emit: _ }) {
    const s = _, i = n, c = p(), e = p(), d = p(!1), v = () => new Promise((t, o) => {
      if (window.google && window.google.maps && window.google.maps.places)
        t();
      else if (!d.value) {
        d.value = !0;
        const l = document.createElement("script");
        l.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${i.apiKey}&libraries=places&v=weekly&callback=initMap`
        ), window.initMap = () => {
          t();
        }, l.onerror = async (r) => {
          o(r);
        }, document.head.appendChild(l);
      }
    }), h = () => {
      if (c.value) {
        const t = google.maps.places, o = new t.Autocomplete(c.value, {
          fields: ["formatted_address", "address_components", "geometry", "name"],
          types: i.types,
          strictBounds: !1
        });
        o.addListener("place_changed", async () => {
          var g, f, w;
          e.value = await o.getPlace();
          const l = await e.value.geometry.location.lat(), r = await e.value.geometry.location.lng();
          let u = "", m = "", y = "";
          for (const a of (g = e.value) == null ? void 0 : g.address_components)
            a.types.includes("locality") ? u = await a.long_name : a.types.includes("administrative_area_level_1") ? m = await a.long_name : a.types.includes("country") && (y = await a.long_name);
          const k = {
            name: (f = e.value) == null ? void 0 : f.name,
            city: u,
            state: m,
            country: y,
            latitude: l,
            longitude: r
          };
          s("update:modelValue", (w = e.value) == null ? void 0 : w.name), i.isFullPayload ? s("set", e.value) : s("set", k);
        });
      }
    };
    return P(async () => {
      try {
        await v(), await B(), h();
      } catch (t) {
        console.error("Failed to load Google Maps API", t);
      }
    }), M(() => {
      delete window.initMap;
    }), (t, o) => (S(), x("input", {
      ref_key: "origin",
      ref: c,
      type: "text",
      class: b(n.class),
      placeholder: n.placeholder
    }, null, 10, C));
  }
});
export {
  G as GoogleAutocomplete
};
