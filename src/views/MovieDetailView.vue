<template>
  <div class="MovieDetailView">
    <div v-if="movie" class="movie-details flex flex-col items-center">
      <img :src="posterURL" alt="Movie Poster" class="mb-2" />
      <div class="flex flex-col items-center">
        <span class="font-bold text-xl">{{ movie.title }}</span>
        <span>By {{ director }}</span>
        <div class="details text-xs flex flex-col items-center text-gray-500">
          <span>Released on {{ releaseDate }}</span>
          <span>Starring {{ cast.join(', ') }}</span>
          <span>{{ duration }}</span>
          <span>
            Original title: <span class="italic">{{ movie.original_title }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

const movie = inject('selectedMovie') as { value: Movie | null }

const posterURL = computed(() =>
  movie.value ? `https://image.tmdb.org/t/p/w200${movie.value.poster_path}` : ''
)
const credits = computed(() => (movie.value ? movie.value.credits : null))
const director = computed(() =>
  credits.value ? credits.value.crew.find((member) => member.job === 'Director')?.name : ''
)
const releaseDate = computed(() =>
  movie.value
    ? new Date(movie.value.release_date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''
)
const cast = computed(() =>
  credits.value ? credits.value.cast.map((member) => member.name).slice(0, 4) : []
)
const duration = computed(() => {
  if (!movie.value) {
    return ''
  }
  const hours = Math.floor(movie.value.runtime / 60)
  const minutes = movie.value.runtime % 60
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`
})
</script>
