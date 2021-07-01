import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PostForm from '../PostForm/PostForm'

import { createPost } from '../../../api/posts'

class CreatePost extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: {
        title: '',
        imageURL: '',
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

    createPost(post, user)

      .then(res => {
        this.setState({ createId: res.data.post._id })
        return res
      })
      .then(res => msgAlert({
        heading: 'Created Post Successfully',
        message: `Successfully Created ${res.data.post.title}`,
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
      return <Redirect to={`/posts/${createId}`} />
    }

    return (
      <div>
        <h2 style={{ marginTop: '30px', marginBottom: '-10px', fontSize: '40px' }}>Create Your Post!</h2>
        <PostForm
          post={post}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default CreatePost
