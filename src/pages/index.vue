<template>
  <v-app>
    <!-- Navegação lateral -->
    <v-navigation-drawer v-model="drawer">
      <v-list-item title="Menu Principal" class="text-center"></v-list-item>
      <v-divider></v-divider>
      <router-link :to="item.to"  v-for="item in items" :key="item.text">
        <v-list-item>
            <v-list-item-content>
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-navigation-drawer>

    <!-- Barra de navegação superior -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Parnaiba360</v-app-bar-title>

      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchQuery"
        append-icon="mdi-magnify"
        label="Pesquisar"
        hide-details
        class="search-field"
        outlined
        dense
        @input="onSearch"
      />
    </v-app-bar>

    <!-- Conteúdo principal -->
    <v-main>
      <!-- Adicionando o mapa Leaflet -->
      <v-container fluid class="pa-0">
      <Mapa1></Mapa1>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import debounce from 'lodash.debounce'


import Mapa1 from '@/components/mapa1.vue';

// Controle da navegação
const drawer = ref(false)

// Itens do menu com ícones e links
const items = [
  { text: "Pontos Turísticos", icon: "mdi-google-maps", to: "/turismo" },
  { text: "Hotéis", icon: "mdi-bed", to: "/hoteis" },
  { text: "Roteiro", icon: "mdi-calendar", to: "/roteiro" },
  { text: "Restaurante", icon: "mdi-food", to: "restaurante" },
  { text: "Feedback", icon: "mdi-comment-quote-outline", to: "/feedback" },
]

// Variável para armazenar o valor da pesquisa
const searchQuery = ref("")

// Função que pode ser chamada ao digitar algo na pesquisa com debounce
const onSearch = debounce(() => {
  console.log("Buscando por:", searchQuery.value)
}, 500)

// Função para alternar o estado do drawer
const toggleDrawer = () => {
  drawer.value = !drawer.value
}


</script>

<style scoped>
/* Definindo o tema azul claro e branco */
.v-application {
  background-color: #f0f4f8; /* Cor de fundo clara */
}

.v-app-bar {
  background-color: #1976D2; /* Azul escuro para a barra */
}

.v-navigation-drawer {
  background-color: #E3F2FD; /* Azul claro para a navegação */
}

.v-list-item {
  color: #1976D2; /* Azul escuro para o texto do menu */
}

.v-list-item:hover {
  background-color: #BBDEFB; /* Azul mais claro ao passar o mouse */
}

.v-icon {
  color: #1976D2; /* Azul escuro para os ícones */
}

.text-nav-title {
  color: white; /* Título na barra de navegação em branco */
}

.search-field {
  width: 300px; /* Largura do campo de pesquisa */
}

/* Estilo para o mapa */
#map {
  height: 100vw;  /* Altura do mapa ajustada */
  width: 400%;    /* Largura do mapa ajustada */

}
</style>
