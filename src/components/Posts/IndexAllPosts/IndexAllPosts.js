import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import './IndexPosts.css'

import { indexAllPost } from './../../../api/posts'

class PostIndexAll extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: null
    }
  }

  componentDidMount () {
    const { msgAlert, user } = this.props

    // make a request to get posts & pass in user for the token
    indexAllPost(user)
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
          heading: 'Failed To Load Coffee Creations',
          message: `Could Not Load Posts: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  render () {
    const { posts } = this.state
    if (!posts) {
      return 'Loading...'
    }

    // turn each post into a React Element (JSX)
    // .map() returns a new array
    // Loop through posts & render a post component for each one
    const postsJsx = posts.map(post => (
      // Use unique identifier (the post's id) for key when iterating through an array
      <Card key={post._id} className='posts-index-one'>
        {/* when clicking on card, link to show post */}
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
