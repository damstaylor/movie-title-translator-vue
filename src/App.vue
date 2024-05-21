<template>
  <div class="App">
    <div class="mb-5">
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
    </div>
    <div v-if="selectedMovie" class="flex flex-col items-center">
      <img class="mb-2 w-fit" :src="getPosterURL(selectedMovie)" :alt="selectedMovie.title" />
      <div class="flex flex-col items-center">
        <span class="font-bold text-xl">{{ selectedMovie.title }}</span>
        <span>By {{ getDirector(selectedMovie) }}</span>
        <div class="details text-xs flex flex-col items-center text-gray-500">
          <span>Released on {{ getMovieReleaseDate(selectedMovie) }}</span>
          <span>Starring {{ getCast(selectedMovie).join(', ') }}</span>
          <span>{{ getDuration(selectedMovie) }}</span>
          <span>
            Original title: <span class="italic">{{ getOriginalTitle(selectedMovie) }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from 'vue'
import SearchDropdown from './components/SearchDropdown.vue'

const API_KEY = 'c3ee2bb51e36fe8ee23b3c051a560200'
const BASE_URL = 'https://api.themoviedb.org/3/'
const BASE_URL_IMG = 'https://image.tmdb.org/t/p/'
const NB_RESULTS = 5

export default {
  components: { SearchDropdown },
  setup() {
    const searchTitle = ref('')
    const sourceLang = ref('en-US')
    const destinationLang = ref('fr-CA')
    const movies = ref<Movie[]>([])
    const selectedMovie = ref<Movie | null>(null)

    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}search/movie?api_key=${API_KEY}&query=${searchTitle.value}&language=${sourceLang.value}`
        )
        const res = await response.json()
        movies.value = res.results.slice(0, NB_RESULTS)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchMovieById = async (id: number) => {
      try {
        const response = await fetch(
          `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=${destinationLang.value}&include_image_language=fr&append_to_response=credits`
        )
        const res = await response.json()
        selectedMovie.value = res
      } catch (err) {
        console.error(err)
      }
    }

    watch([searchTitle, sourceLang], () => {
      if (searchTitle.value) {
        fetchMovies()
      }
    })
    watch(destinationLang, () => {
      if (selectedMovie.value) {
        fetchMovieById(selectedMovie.value.id)
      }
    })

    const getFormattedMovies = computed(() => {
      return movies.value.map((movie: Movie) => ({
        title: movie.title,
        subtitle: getMovieReleaseYear(movie),
        img: getPosterURL(movie),
        id: movie.id
      }))
    })

    const handleMovieSearchInput = (value: string) => {
      searchTitle.value = value
      if (value) {
        fetchMovies()
      }
    }

    const handleMovieSelect = (item: DropdownItem) => {
      fetchMovieById(item.id)
      searchTitle.value = ''
    }

    const getMovieReleaseYear = (movie: Movie) => movie?.release_date.slice(0, 4)
    const getMovieReleaseDate = (movie: Movie) =>
      new Date(movie.release_date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    const getDirector = (movie: Movie) =>
      movie?.credits?.crew?.find((member: Person) => member.job === 'Director')?.name
    const getCast = (movie: Movie, nb = 4) =>
      movie?.credits?.cast ? movie?.credits?.cast?.map((member) => member.name).slice(0, nb) : []
    const getOriginalTitle = (movie: Movie) => movie?.original_title
    const getDuration = (movie: Movie) =>
      (movie.runtime >= 60 ? `${Math.floor(movie.runtime / 60)}h` : '') + `${movie.runtime % 60}min`
    const getPosterURL = (movie: Movie, width = 200) =>
      movie?.poster_path ? `${BASE_URL_IMG}w${width}${movie.poster_path}` : ''

    return {
      searchTitle,
      sourceLang,
      destinationLang,
      formattedMovies: getFormattedMovies,
      selectedMovie,
      handleMovieSearchInput,
      handleMovieSelect,
      getMovieReleaseYear,
      getMovieReleaseDate,
      getDirector,
      getCast,
      getOriginalTitle,
      getDuration,
      getPosterURL
    }
  }
}
</script>
