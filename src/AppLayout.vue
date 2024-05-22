<template>
  <div class="AppLayout">
    <header class="mb-5">
      <h1 class="text-4xl font-bold text-blue-500 mb-5">Movie title translator</h1>
      <div class="search-options">
        <div class="search-options-source">
          <span>Search movie or TV show title in</span>
          <select v-model="sourceLang">
            <option value="en-US">English (USA)</option>
            <option value="fr-CA">Français (Canada)</option>
            <option value="fr-FR">Français (France)</option>
          </select>
        </div>
        <div class="search-options-destination">
          <span>Translate to</span>
          <select v-model="destinationLang">
            <option value="en-US">English (USA)</option>
            <option value="fr-CA">Français (Canada)</option>
            <option value="fr-FR">Français (France)</option>
          </select>
        </div>
      </div>
      <SearchDropdown
        :items="formattedMovies"
        @search-input="handleMovieSearchInput"
        @item-select="handleMovieSelect"
      />
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchDropdown from './components/SearchDropdown/SearchDropdown.vue'

const router = useRouter()
const route = useRoute()
const sourceLang = ref('en-US')
const destinationLang = ref('fr-CA')
const searchTitle = ref('')
const selectedMovie = ref<Movie | null>(null)
const movies = ref([])

provide('selectedMovie', selectedMovie)

const fetchMovies = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=c3ee2bb51e36fe8ee23b3c051a560200&query=${searchTitle.value}&language=${sourceLang.value}`
    )
    const data = await response.json()
    movies.value = data.results.slice(0, 5)
  } catch (error) {
    console.error(error)
  }
}

const handleMovieSearchInput = (value: string) => {
  searchTitle.value = value
  if (value) {
    fetchMovies()
  }
}

const handleMovieSelect = (item: Movie) => {
  selectedMovie.value = item
  searchTitle.value = ''
  router.push({ path: `/movie/${item.id}` })
}

const formattedMovies = computed(() => {
  return movies.value.map((movie: Movie) => ({
    title: movie.title,
    subtitle: movie.release_date.slice(0, 4),
    img: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
    id: movie.id
  }))
})

const fetchMovieById = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=c3ee2bb51e36fe8ee23b3c051a560200&language=fr-CA&include_image_language=fr&append_to_response=credits`
    )
    const data = await response.json()
    selectedMovie.value = data as Movie
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchMovieById(newId as string)
    } else {
      selectedMovie.value = null
    }
  },
  { immediate: true }
)
</script>
