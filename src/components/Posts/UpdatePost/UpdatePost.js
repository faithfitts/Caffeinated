import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import PostFormUpdate from '../PostForms/PostFormUpdate'

import { showPost, updatePost } from '../../../api/posts'

class UpdatePost extends Component {
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
      createId: null,
      updated: false
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

  // Maintain reviews after post update
  componentDidMount () {
    const { user, match } = this.props
    const id = match.params.id
    showPost(id, user)
      .then(res => this.setState({ post: res.data.post }))
      .catch()
  }

  handleSubmit = event => {
    event.preventDefault()

    const { user, match, msgAlert } = this.props
    const { post } = this.state

    const id = match.params.id

    updatePost(id, post, user)
      .then(res => {
        this.setState({ updated: true })
        return res
      })
      .then(res => msgAlert({
        heading: 'Updated Post Successfully',
        message: 'Update Successful',
        variant: 'success'
      }))
      .catch(error => msgAlert({
        heading: 'Failed to Post',
        message: `Failed to Post with error: ${error.message}`,
        variant: 'danger'
      }))
  }

  render () {
    const { post, updated } = this.state

    if (updated) {
      return <Redirect to={`/posts/${this.props.match.params.id}`} />
    }

    return (
      <div>
        <h2 style={{ marginTop: '30px', marginBottom: '-10px', fontSize: '40px' }}>Update Your Post!</h2>
        <PostFormUpdate
          post={post}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default withRouter(UpdatePost)
