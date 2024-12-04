<template>
  <v-card
    outlined
    class="map-section rounded-lg overflow-hidden"
  >
    <div
      id="map"
      class="map-container"
    />
    <v-card-actions class="map-controls pa-4">
      <v-row
        no-gutters
        align="center"
        justify="end"
        class="w-100"
      >
        <v-col
          cols="12"
          sm="4"
          class="ps-sm-2"
        >
          <v-btn
            block
            color="primary"
            :loading="loadingLocation"
            @click="getCurrentLocation"
          >
            <v-icon start>
              mdi-crosshairs-gps
            </v-icon>
            Minha Localização
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, defineEmits, reactive } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import supabase from "@/Composables/supabase";
import { useRoute } from 'vue-router';
import { da } from "vuetify/locale";

const route = useRoute();

const emit = defineEmits(["location-selected"]);

const loadingLocation = ref(false);
const map = ref(null)
const currentMarker = ref(null);
const locations = reactive( [
    // { lat: -2.902957, lng: -41.768434, title: "Praça Mandu Ladino" },
    // { lat: -2.910237, lng: -41.744985, title: "Restaurante Mangata" },
    // { lat: -2.909734, lng: -41.746951, title: "Parnaíba Shopping" },
    // { lat: -2.900464, lng: -41.780282, title: "Museu do Mar" },
    // { lat: -2.816892, lng: -41.728505, title: "Praia Pedra do Sal" },
    // { lat: -2.929462, lng: -41.676876, title: "Lagoa do Portinho" },
    // { lat: -2.913962, lng: -41.753847, title: "Citi Executivo Hotel" },
    // { lat: -2.908528, lng: -41.752094, title: "Hotel Portal dos Ventos" },
    // { lat: -2.903851, lng: -41.754304, title: "Nautillus Hotel" },
  ])
const category = ref("")
onMounted(async () => {
  category.value = route.path.replace("/", "")
  
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  map.value = L.map("map").setView([ -2.90393, -41.7763], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);

  map.value.on("click", async (e) => {
    const { lat, lng } = e.latlng;
    await reverseGeocode(lat, lng);
  });

  console.log(supabase)
  await fetchData()
  getCurrentLocation();
  addCustomMarkers();
});

const fetchData = async () => {
  try {
    let { data, error } = await supabase.from("locais").select()
    let listfitered = data
    if (category.value !== "")
      listfitered = data.filter(it => it.category === category.value)
    locations.splice(0, locations.length, ...listfitered)
  if(error){
    console.log(error)
  }
  console.log(data)
  } catch (error) {
    console.log(error)
  }

}

// Adicionar localizações personalizadas no mapa
const addCustomMarkers = () => {
  locations.forEach((location) => {
    const { lat, lng, title } = location;
    const marker = L.marker([lat, lng]).addTo(map.value);
    marker.bindPopup(`<b>${title}</b>`); // Exibir título no popup
  });
};

const getCurrentLocation = () => {
  loadingLocation.value = true;
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada");
    loadingLocation.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      await reverseGeocode(latitude, longitude);
      loadingLocation.value = false;
    },
    (error) => {
      console.error("Erro de localização:", error);
      alert("Não foi possível obter sua localização");
      loadingLocation.value = false;
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();

    if (data && data.address) {
      const { road, neighbourhood, suburb, postcode, city, country } =
        data.address;
      const formattedAddress = [
        road,
        neighbourhood || suburb,
        postcode,
        city,
        country,
      ]
        .filter(Boolean)
        .join(", ");

      updateMarkerAndAddress(lat, lng, formattedAddress);
    }
  } catch (error) {
    console.error("Erro na geocodificação reversa:", error);
  }
};

const updateMarkerAndAddress = (lat, lng, address) => {
  if (currentMarker.value) {
    map.value.removeLayer(currentMarker.value);
  }

  currentMarker.value = L.marker([lat, lng]).addTo(map.value);
  emit("location-selected", { address, lat, lng });
  map.value.setView([lat, lng], 16);
};
// var teatroIcon = L.icon({
//   iconUrl: '@/assets/teatro.png',

//   iconSize:     [38, 95], // size of the icon

//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location

//     popupAnchor:  [-3, -76]
// })

// // L.marker([51.5, -0.09], {icon: teatroIcon}).addTo(map).bindPopup("I am a green leaf.");
// L.marker([51.5, -0.09], {icon: teatroIcon}).addTo(map);
// var marcador = L.marker([-2.902957, -41.768434]).addTo(map).bindPopup("Praça Mandu Ladino")
</script>

<style scoped>
.map-container {
  height: 600px;  /* Altura do mapa ajustada */
  width: 100%;    /* Largura do mapa ajustada */
}

.map-section {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;

}

.map-section:hover {
  border-color: rgba(0, 0, 0, 0.24);
}

/* Responsividade */
@media (max-width: 600px) {
  .map-container {
    height: 250px; /* Mapa menor em telas pequenas */
  }

  .map-controls {
    padding: 16px;
  }
}
</style>
