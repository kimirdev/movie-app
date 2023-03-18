import { Pagination, Spin, Alert } from 'antd'
import React from 'react'

import MovieCard from '../movie-card'

import './movie-list.css'

function MovieList({ movies, onPageChange, total, page, loading, tab }) {
  let movieList

  if (total === 0) {
    movieList =
      tab === 'search' ? (
        <li>
          <Alert message="Movies not found" description="Movies matching your search were not found" type="info" />
        </li>
      ) : (
        <li>
          <Alert message="Rated list is empty" description="You haven't rated any movie yet" type="info" />
        </li>
      )
  } else {
    movieList = movies.map((m) => (
      <li key={m.id}>
        <MovieCard movie={m} />
      </li>
    ))
  }

  return (
    <>
      <ul className="movie-list">
        {loading ? (
          <div className="spin">
            <Spin size="large" />
          </div>
        ) : (
          movieList
        )}
      </ul>

      {tab === 'search' && (
        <Pagination
          current={page}
          total={total}
          onChange={onPageChange}
          pageSize={20}
          showSizeChanger={false}
          className="pagination"
          responsive
        />
      )}
    </>
  )
}

export default MovieList
