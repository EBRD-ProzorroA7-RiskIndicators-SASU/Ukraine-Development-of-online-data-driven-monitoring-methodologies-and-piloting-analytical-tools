import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './NotFound.css'

class NotFound extends Component {

  render() {
    return (
      <div className="NotFound container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="bold">404</h1>
            <h4 className="bold">Page not found. Go to <Link to="/">Home Page</Link></h4>
          </div>
        </div>
      </div>
    )
  }
}

export default NotFound
