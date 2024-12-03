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
import { ref, onMounted, defineEmits } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const emit = defineEmits(["location-selected"]);

const loadingLocation = ref(false);
const map = ref(null);
const currentMarker = ref(null);

onMounted(() => {
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

  getCurrentLocation();
});

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
