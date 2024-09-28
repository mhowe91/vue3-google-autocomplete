(function(t,e){typeof exports=="object"&&typeof module<"u"?e(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.VueGoogleAutocomplete={},t.Vue))})(this,function(t,e){"use strict";const h=["placeholder"],A=e.defineComponent({__name:"GoogleAutocomplete",props:{modelValue:{type:String,default:""},apiKey:{type:String,required:!0},placeholder:{type:String,default:""},types:{type:Array,default:()=>[]},isFullPayload:{type:Boolean,default:!1},class:{type:String,default:""}},emits:["update:modelValue","set"],setup(i,{emit:k}){const c=k,r=i,d=e.ref(),o=e.ref(),u=e.ref(!1),v=()=>new Promise((a,n)=>{if(window.google&&window.google.maps&&window.google.maps.places)a();else if(!u.value){u.value=!0;const s=document.createElement("script");s.setAttribute("src",`https://maps.googleapis.com/maps/api/js?key=${r.apiKey}&libraries=places&v=weekly&callback=initMap`),window.initMap=()=>{a()},s.onerror=async p=>{n(p)},document.head.appendChild(s)}}),P=()=>{if(d.value){const a=google.maps.places,n=new a.Autocomplete(d.value,{fields:["formatted_address","address_components","geometry","name"],types:r.types,strictBounds:!1});n.addListener("place_changed",async()=>{var g,w,_;o.value=await n.getPlace();const s=await o.value.geometry.location.lat(),p=await o.value.geometry.location.lng();let m="",f="",y="";for(const l of(g=o.value)==null?void 0:g.address_components)l.types.includes("locality")?m=await l.long_name:l.types.includes("administrative_area_level_1")?f=await l.long_name:l.types.includes("country")&&(y=await l.long_name);const S={name:(w=o.value)==null?void 0:w.name,city:m,state:f,country:y,latitude:s,longitude:p};c("update:modelValue",(_=o.value)==null?void 0:_.name),r.isFullPayload?c("set",o.value):c("set",S)})}};return e.onMounted(async()=>{try{await v(),await e.nextTick(),P()}catch(a){console.error("Failed to load Google Maps API",a)}}),e.onBeforeUnmount(()=>{delete window.initMap}),(a,n)=>(e.openBlock(),e.createElementBlock("input",{ref_key:"origin",ref:d,type:"text",class:e.normalizeClass(i.class),placeholder:i.placeholder},null,10,h))}});t.GoogleAutocomplete=A,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
