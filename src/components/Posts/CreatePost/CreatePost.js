import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PostFormCreate from '../PostForms/PostFormCreate'

import { createPost } from '../../../api/posts'

class CreatePost extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: {
        title: '',
        imageURL: 'https://i.imgur.com/xcaVXzQ.png',
        description: '',
        ingredients: '',
        instructions: '',
        notes: '',
        reviews: []
      },
      createId: null
    }
  }

  handleChange = event => {
    // ensure the properties are not set to null after handleChange is finished
    event.persist()
    this.setState((state) => {
      return {
        post: { ...state.post, [event.target.name]: event.target.value }
      }
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { user, msgAlert } = this.props
    const { post } = this.state

    // API request call Create Post
    createPost(post, user)
      .then(res => {
        // set the createId to the id of the post we just created
        this.setState({ createId: res.data.post._id })
        return res
      })
      .then(res => msgAlert({
        heading: 'Post Created Successfully',
        message: `Thank You For Posting: ${res.data.post.title}`,
        variant: 'success'
      }))
      .catch(error => msgAlert({
        heading: 'Failed to Create Post',
        message: `Failed to Create with error: ${error.message}`,
        variant: 'danger'
      }))
  }

  render () {
    const { post, createId } = this.state
    if (createId) {
      // redirect to the ShowPost page
      return <Redirect to={`/posts/${createId}`} />
    }

    // Return the PostForm for Create
    return (
      <div>
        <h2 style={{ marginTop: '30px', marginBottom: '-10px', fontSize: '40px' }}>Create Your Post!</h2>
        <PostFormCreate
          post={post}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default CreatePost
