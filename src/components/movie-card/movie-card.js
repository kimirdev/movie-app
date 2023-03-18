import { Image, Rate, Space, Spin, Tag } from 'antd'
import { format, parseISO } from 'date-fns'
import { React, useContext, useEffect, useState } from 'react'

import GenreContext from '../../contexts/genres'
import moviedb from '../../services/moviedb'

import './movie-card.css'
import noImg from './no-image-icon.png'

function truncate(str, n, useWordBoundary) {
  if (str.length <= n) {
    return str
  }
  const subString = str.slice(0, n - 1)
  return `${useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString}...`
}

function MovieCard({ movie }) {
  const [rate, setRate] = useState(0)
  const {
    poster_path: path,
    original_title: title,
    overview,
    vote_average: votes,
    release_date: date,
    id,
    rating,
  } = movie

  useEffect(() => {
    setRate(rating)
  }, [rating])

  let genres = useContext(GenreContext)
  // eslint-disable-next-line react/destructuring-assignment
  genres = genres.filter((g) => movie.genre_ids.includes(g.id))

  const description = overview.length > 120 ? truncate(overview, 120, true) : overview

  // eslint-disable-next-line react/destructuring-assignment
  const tags = genres.map((el) => <Tag key={el.id}>{el.name}</Tag>)

  let votesClasses = 'rating '
  if (votes > 7) {
    votesClasses += 'good'
  } else if (votes > 5) {
    votesClasses += 'ok'
  } else if (votes > 3) {
    votesClasses += 'bad'
  } else {
    votesClasses += 'worst'
  }

  const onRate = (value) => {
    setRate(value)

    if (value === 0) {
      moviedb.deleteMovieRate(id)
    } else {
      moviedb.rateMovie(id, value)
    }
  }

  return (
    <div className="card">
      <div className="poster">
        <Image
          src={`https://image.tmdb.org/t/p/w200${path}`}
          fallback={noImg}
          alt="poster"
          preview={{ src: `https://image.tmdb.org/t/p/w500${path}` }}
          placeholder={
            <Space align="center" size="middle" className="imgSpace">
              <Spin className="imgSpinner" />
            </Space>
          }
        />
      </div>
      <div className="description">
        <div className="description__header">
          <p className="title">{title}</p>
          <p className="date">{date && format(parseISO(date), 'MMMM dd, yyyy')}</p>
          <p className={votesClasses}>{votes.toFixed(1)}</p>
        </div>
        <p className="tags">{tags}</p>
        <p className="overview">{description}</p>

        <Rate value={rate} onChange={onRate} count="10" />
      </div>
    </div>
  )
}

export default MovieCard
