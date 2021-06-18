import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

import { postIndexAll } from './../../../api/posts'

// const cardContainerLayout = {
//   display: 'inline-flex',
//   justifyContent: 'center',
//   flexFlow: 'row wrap',
//   marginLeft: -600,
//   marginRight: -600,
//   marginTop: -150,
//   padding: 200
// }

class PostIndexAll extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: null
    }
  }
  componentDidMount () {
    const { msgAlert, user } = this.props

    postIndexAll(user)
      .then(res => {
        this.setState({ posts: res.data.post })
      })
      .then(() => msgAlert({
        heading: 'Welcome To The Home Page',
        message: 'Click A Creation To See Details',
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Can Not Load Creations',
          message: `could not load posts: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  render () {
    const { posts } = this.state
    if (!posts) {
      return 'Loading...'
    }

    const postsJsx = posts.map(post => (
      <Card key={post._id} className='content-bg'>
        <Card.Img src={post.imageURL} style={{ height: '18rem' }} />
        <Card.Body>
          <Card.Title style={{ fontSize: '33px' }}>{post.title}</Card.Title>
          <Card.Text>{post.description}</Card.Text>
          <Card.Link className='content-sm' href={`#posts/${post._id}`}> Click Here To Learn More!</Card.Link>
        </Card.Body>
      </Card>
    ))

    return (
      <div className='content-md'>
        { postsJsx }
      </div>
    )
  }
}

export default PostIndexAll
