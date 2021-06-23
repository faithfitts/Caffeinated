import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import PostForm from '../PostForm/PostForm'

import { updatePost, showPost } from '../../../api/posts'

class UpdatePost extends Component {
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
        comments: []
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

  componentDidMount () {
    const { user, match, msgAlert } = this.props

    const id = match.params.id
    showPost(id, user)
      .then(res => this.setState({ post: res.data.post }))
      .then(() => {
        msgAlert({
          heading: 'Show Success',
          message: 'Edit Post',
          variant: 'success'
        })
      })
      .catch(error => {
        msgAlert({
          heading: 'Show Failed',
          message: `Couldn't Show Because: ${error.message}`,
          variant: 'danger'
        })
      })
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
        <PostForm
          post={post}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default withRouter(UpdatePost)
