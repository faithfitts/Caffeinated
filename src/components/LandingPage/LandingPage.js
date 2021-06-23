import React, { Fragment } from 'react'
import './LandingPage.css'

const authenticatedUser = (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      <h6 className="auth-intro"><a style={{ color: '#f5efe7' }} href={'#index'}>Welcome! Click here to see the latest coffee creations!</a></h6>
      <h6 className="slogan">~ Stay Caffeinated</h6>
    </div>
  </div>
)

const unauthenticatedUser = (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      <h6 className="unauth-intro">Join a community of coffee lovers! Share your most inspiring coffee creations and learn some new tips and tricks to spice up your morning cup of Joe!</h6>
      <h6 className="slogan">~ Stay Caffeinated</h6>
    </div>
  </div>
)

const LandingPage = ({ user }) => (
  <Fragment>
    { user ? authenticatedUser : unauthenticatedUser }
  </Fragment>
)

export default LandingPage
