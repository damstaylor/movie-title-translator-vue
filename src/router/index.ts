import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/AppLayout.vue'
import HomeView from '@/views/HomeView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'HomeView',
          component: HomeView
        },
        {
          path: 'movie/:id',
          name: 'MovieDetailView',
          component: MovieDetailView
        }
      ]
    }
  ]
})

export default router
