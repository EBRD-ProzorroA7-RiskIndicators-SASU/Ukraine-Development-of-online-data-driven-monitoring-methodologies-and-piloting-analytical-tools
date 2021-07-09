import React from 'react'
import { Logo, BackPageIcon } from '../../assets/icons'
import { Link } from 'react-router-dom'
import BG from '../../assets/bg.svg'
import './styles.scss'

const PageNotFound = () => {
  return (
    <div
      className="page-not-found-wrapper"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="page-content">
        <div className="page-not-found-header">
          <Link to="/" style={{ display: 'flex' }}>
            <div className="logo">
              <Logo />
            </div>
            <div className="color-border">
              <span className="blue" />
              <span className="yellow" />
            </div>
            <div className="logo-title">
            <span className="logo-title__top">
              monitoring
                </span>
              {/*<div className="logo-title__bottom">*/}
              {/*  site.gov.ua*/}
              {/*</div>*/}
            </div>
          </Link>
        </div>
        <div className="page-not-found-title">
          <span className="title__top">
            404
          </span>
          <span className="title__bottom">
            Сторінку не знайдено
          </span>
          <Link className="back-to-main-page" to='/'>
            <BackPageIcon />
            <span>
              Повернутися на головну
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
