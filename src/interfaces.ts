interface DropdownItem {
  title: string
  subtitle?: string
  img: string
  id: number
}

interface Person {
  job: string
  name: string
}

interface Movie {
  adult: false
  backdrop_path: string
  credits?: {
    crew: Person[]
    cast: Person[]
  }
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  runtime: number
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
