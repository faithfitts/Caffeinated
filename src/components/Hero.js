import React, { Fragment } from 'react'
import '../index.scss'

const authenticatedUser = (
  <div className="jumbotron1 jumbotron-fluid">
    <div className="container">
      <h6 className="display-1">Welcome! Click <a href={'#index'}>HERE</a> to see the latest coffee creations!</h6>
      <h6 className="display-2">~ Stay Caffeinated</h6>
    </div>
  </div>
)

const unauthenticatedUser = (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      <h6 className="display-5">Join a community of coffee lovers! Share your most inspiring coffee creations and learn some new tips and tricks to spice up your morning cup of Joe!</h6>
      <h6 className="display-6">~ Stay Caffeinated</h6>
    </div>
  </div>
)

const LandingPage = ({ user }) => (
  <Fragment>
    { user ? authenticatedUser : unauthenticatedUser }
  </Fragment>
)

export default LandingPage
