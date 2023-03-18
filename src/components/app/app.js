import React, { useState, useEffect } from 'react'
import { Alert, Input, Layout, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import { Content, Header } from 'antd/es/layout/layout'

import './app.css'

import MovieList from '../movie-list'
import moviedb from '../../services/moviedb'
import useDebounce from '../../hooks/debounce'
import GenreContext from '../../contexts/genres'

const items = [
  {
    key: 'search',
    label: 'Search',
  },
  {
    key: 'rated',
    label: 'Rated',
  },
]

function App() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [tab, setTab] = useState('search')

  const debouncedSearch = useDebounce(search, 500)

  const setStates = (r) => {
    setMovies(r.results)
    setTotal(r.total_results)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    if (tab === 'search') {
      moviedb.getMovies(debouncedSearch, page).then(async (res) => {
        const rates = await moviedb.getRatedMovies()
        const newItem = {
          results: res.results.map((x) => rates.results.find((p) => p.id === x.id) || x),
          total_results: res.total_results,
        }
        setStates(newItem)
      })
    } else if (tab === 'rated') {
      moviedb.getRatedMovies().then((res) => setStates(res))
    }
  }, [debouncedSearch, page, tab])

  useEffect(() => {
    moviedb.getGenres().then((resp) => setGenres(resp))

    const sessionId = sessionStorage.getItem('guestSessionId')
    if (sessionId == null) {
      moviedb.createGuestSession().then((s) => sessionStorage.setItem('guestSessionId', s.guest_session_id))
    }
  }, [])

  const onSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <Layout className="app">
      <Online>
        <Header className="header">
          <Tabs items={items} className="tabs" onChange={setTab} centered />
          {tab === 'search' && (
            <Input
              placeholder="Type to search..."
              value={search}
              onChange={(e) => onSearchChange(e)}
              size="large"
              className="input"
            />
          )}
        </Header>
        <Content className="content">
          <GenreContext.Provider value={genres}>
            <MovieList movies={movies} onPageChange={setPage} total={total} page={page} loading={loading} tab={tab} />
          </GenreContext.Provider>
        </Content>
      </Online>
      <Offline>
        <Alert
          message="No internet"
          description="No network connection."
          type="error"
          showIcon
          style={{ top: '200px' }}
        />
      </Offline>
    </Layout>
  )
}

export default App
