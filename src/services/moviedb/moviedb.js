class MovieDbService {
  moviedbapi = 'https://api.themoviedb.org/3/'

  apikey = 'api_key=3926f93a695102f8a87c82c55f8a5308'

  lang = 'language=en-US'

  getGenres() {
    const url = `${this.moviedbapi}genre/movie/list?${this.apikey}&${this.lang}`
    return fetch(url)
      .then((resp) => resp.json())
      .then((resp) => resp.genres)
  }

  getMovies(query, page = 1) {
    const url = `${this.moviedbapi}search/movie?${this.apikey}&${this.lang}&query=${query}&page=${page}&include_adult=false`

    return fetch(url).then((resp) => resp.json())
  }

  createGuestSession() {
    const url = `${this.moviedbapi}authentication/guest_session/new?${this.apikey}`

    return fetch(url).then((resp) => resp.json())
  }

  rateMovie(movieId, value) {
    const guestSessionId = sessionStorage.getItem('guestSessionId')
    const url = `${this.moviedbapi}movie/${movieId}/rating?${this.apikey}&guest_session_id=${guestSessionId}`

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    }).then((resp) => resp.json())
  }

  deleteMovieRate(movieId) {
    const guestSessionId = sessionStorage.getItem('guestSessionId')
    const url = `${this.moviedbapi}movie/${movieId}/rating?${this.apikey}&guest_session_id=${guestSessionId}`

    fetch(url, {
      method: 'DELETE',
    }).then((resp) => resp.json())
  }

  getRatedMovies() {
    const guestSessionId = sessionStorage.getItem('guestSessionId')
    const url = `${this.moviedbapi}guest_session/${guestSessionId}/rated/movies?${this.apikey}&language=en-US&sort_by=created_at.asc`

    return fetch(url).then((resp) => resp.json())
  }
}

const moviedb = new MovieDbService()

export default moviedb
