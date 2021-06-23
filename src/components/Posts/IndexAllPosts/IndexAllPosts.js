import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import './IndexAllPosts.css'

import { postIndexAll } from './../../../api/posts'

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
      <Card key={post._id} className='posts-index-one'>
        <Card.Link href={`#posts/${post._id}`}>
          <Card.Img src={post.imageURL} style={{ height: '18rem' }} />
          <Card.Body>
            <Card.Title style={{ marginBottom: '-5px', fontSize: '30px', textAlign: 'center' }}>{post.title}</Card.Title>
          </Card.Body>
        </Card.Link>

      </Card>
    ))

    return (
      <div className='posts-index-all'>
        { postsJsx.reverse() }
      </div>
    )
  }
}

export default PostIndexAll
