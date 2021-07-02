import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import './IndexPosts.css'

import { postIndexUser } from './../../../api/posts'

class PostIndexUser extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: null
    }
  }

  componentDidMount () {
    const { msgAlert, user } = this.props

    postIndexUser(user)
      .then(res => {
        this.setState({ posts: res.data.post })
      })
      .then(() => msgAlert({
        heading: 'Now Viewing Your Coffee Creations',
        message: 'Click A Creation To See Details',
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Failed To Load Your Coffee Creations',
          message: `Could Not Load Your Coffee Creations: ${error.message}`,
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

export default PostIndexUser
