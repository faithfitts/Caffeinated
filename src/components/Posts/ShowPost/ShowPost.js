import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import CreateComment from './../../Comments/CreateComment/CreateComment'

import { showPost, postDelete } from '../../../api/posts'
import { commentDestroy, updateComment } from '../../../api/comments'
import '../../../index.scss'

class PostShow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: null,
      exists: true,
      deleted: false,
      updateCommentClicked: false,
      showUpdateCommentModal: false,
      updatePostButtonClicked: false,
      commentId: null,
      content: null,
      commentsList: []
    }
  }

  deleteComment = (id, event) => {
    this.setState((state) => {
      return { commentsList: state.commentsList.filter(cmnt => cmnt._id !== id) }
    })
  }

  addNewComment = (comment) => {
    const { match, user } = this.props
    const { post } = this.state

    post.comments.push(comment)

    showPost(match.params.id, user)
      .then(res => this.setState({ post: res.data.post, commentsList: res.data.post.comments }))
  }

  async commentDelete (commentId, event) {
    const { user, msgAlert } = this.props
    const { post } = this.state
    const postId = post._id

    try {
      await commentDestroy(commentId, postId, user)
      await this.deleteComment(commentId, event)
      this.setState({ deleted: true })
    } catch (error) {
      msgAlert({
        heading: 'Comment Delete Failed',
        message: `Couldn't Delete Because: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  handleUpdateClicked = (commentId, event) => {
    this.setState({ updateCommentClicked: true })
    this.setState({ commentId: commentId })
    this.setState({ showUpdateCommentModal: true })
  }

  handleClose = (event) => {
    this.setState({ showUpdateCommentModal: false })
    this.setState({ updateCommentClicked: false })
  }

  updatePostClicked = (event) => {
    this.setState({ updatePostButtonClicked: true })
  }

  async handleUpdate (commentIdForAxios, event) {
    event.preventDefault()
    event.target.reset()

    const { msgAlert, user, match } = this.props
    const { post, content } = this.state
    const postId = post._id

    try {
      await updateComment(content, user, postId, commentIdForAxios)
      const res = await showPost(match.params.id, user)
      await this.setState({ post: res.data.post, commentsList: res.data.post.comments })
      this.setState({ updateCommentClicked: false })
      this.setState({ showUpdateCommentModal: false })
      this.setState({ updatePostButtonClicked: false })
      msgAlert({
        heading: 'Updated Comment Successfully!',
        message: 'Your comment has been updated',
        variant: 'success'
      })
    } catch (error) {
      msgAlert({
        heading: 'Failed to update comment',
        message: `Failed to update with error: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  handleChange = event => {
    event.persist()
    this.setState((state) => {
      return {
        content: { ...state.content, [event.target.name]: event.target.value }
      }
    })
  }

  onPostDelete = () => {
    const { user, match, history, msgAlert } = this.props
    postDelete(match.params.id, user)
      .then(this.setState({ exists: false }))
      .then(() => msgAlert({
        heading: 'Deleted Post Successfully!!!!',
        message: 'The post has been deleted.',
        variant: 'success'
      }))
      .then(() => history.push('/index'))
      .catch(error => {
        msgAlert({
          heading: 'Deleting Post Failed',
          message: `Failed to delete post with error: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  componentDidMount () {
    const { user, match, msgAlert } = this.props

    showPost(match.params.id, user)
      .then(res => {
        // console.log(res)
        this.setState({ post: res.data.post, commentsList: res.data.post.comments })
        return res
      })
      .then(res => msgAlert({
        heading: 'Here is your Creation',
        message: `This is the ${res.data.post.title}`,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Showing Post Failed',
          message: `Failed to show post with error: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  render () {
    const { post, commentsList, commentId, updateCommentClicked, showUpdateCommentModal, updatePostButtonClicked } = this.state
    const { msgAlert, user } = this.props

    if (!post) {
      return 'Loading...'
    }

    if (updatePostButtonClicked) {
      return (
        <Redirect to={`/update-post/${post._id}`}/>
      )
    }

    const userId = user._id
    const ownerId = post.owner._id

    let showDisplay

    // Comment Section
    if (!updateCommentClicked && !showUpdateCommentModal && userId !== ownerId) {
      const commentsJsx = commentsList.map(comment => (
        <Card key={comment._id} className='posts-index-one' style={{ width: '100%', marginTop: '10px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '30px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {comment.owner.username} commented:
              </span>
            </Card.Text>
            <br/>
            <div style={{ marginTop: '-40px', whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </div>

            {/* If the current user is the owner of the comment, allow edit and delete */}
            {comment.owner._id === user._id
              ? <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={(event) => this.handleUpdateClicked(comment._id, event)}
                >
                  Update Comment
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  variant='outline-danger'
                  type='button'
                  onClick={(event) => {
                    this.commentDelete(comment._id, event.target)
                  }}>
                  Delete Comment
                </Button>
              </div>
              : null }
          </Card.Body>
        </Card>

      ))

      // Show this display if the current user is NOT the owner of the post
      showDisplay = (
        <div>
          {/* Title, Image, Creator, Description  */}
          <h1 className='title'>{post.title}</h1>
          <img className='image' src={post.imageURL} />
          <Card key={post.description} className='description' style={{ whiteSpace: 'pre-wrap' }}>
            <Card.Body>
              <span style={{ fontSize: '25px', fontWeight: 'bold', color: '#006400' }}>
                Creator: {post.owner.username}
              </span>
              <Card.Text>{post.description}</Card.Text>
            </Card.Body>
          </Card>

          {/* Ingredients, Instructions, Notes */}
          <div className='info' style={{ marginBottom: '15px', padding: '10px', borderStyle: 'groove', borderRadius: '10px' }}>
            <div className='labels'>Ingredients</div>
            <h6 className='labels__info'>
              {post.ingredients}
            </h6>
            <div className='labels'>Instructions</div>
            <h6 className='labels__info'>
              {post.instructions}
            </h6>
            <div className='labels'>Notes</div>
            <h6 className='labels__info'>
              {post.notes}
            </h6>
          </div>

          {/* Comments Display */}
          <h5 style={{ marginTop: '40px' }}>Comments:</h5>
          <div className="showCommentContainer">
            <ul>
              {commentsJsx}
              <CreateComment
                user={user}
                post={post}
                msgAlert={msgAlert}
                addNewComment={this.addNewComment}
              />
            </ul>
          </div>
        </div>
      )

      // Comments Display
    } else if (!updateCommentClicked && !showUpdateCommentModal && commentsList !== null) {
      const commentsJsx = commentsList.map(comment => (
        <Card key={comment._id} className='posts-index-one' style={{ width: '100%', marginTop: '8px', padding: '5px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '20px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {comment.owner.username} commented:
              </span>
            </Card.Text>
            <br/>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '-30px', padding: '-20px' }}>
              {comment.content}
            </div>

            {/* If the current user is the owner of the comment, allow edit and delete */}
            {comment.owner._id === user._id
              ? <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={(event) => this.handleUpdateClicked(comment._id, event)}
                >
                  Update Comment
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  variant='outline-danger'
                  type='button'
                  onClick={(event) => {
                    this.commentDelete(comment._id, event.target)
                  }}>
                  Delete Comment
                </Button>
              </div>
              : null }
          </Card.Body>
        </Card>
      ))

      // Show this display if the current user IS the owner of the post
      showDisplay = (
        <div>
          {/* Title, Image, Creator, Description  */}
          <h1 className='title'>{post.title}</h1>
          <img className='image' src={post.imageURL} />
          <Card key={post.description} className='description' style={{ whiteSpace: 'pre-wrap' }}>
            <Card.Body>
              <span style={{ fontSize: '25px', fontWeight: 'bold', color: '#006400' }}>
                Creator: {post.owner.username}
              </span>
              <Card.Text>{post.description}</Card.Text>
            </Card.Body>
          </Card>

          {/* Ingredients, Instructions, Notes */}
          <div className='info' style={{ marginBottom: '15px', padding: '10px', borderStyle: 'groove', borderRadius: '10px' }}>
            <div className='labels'>Ingredients</div>
            <h6 className='labels__info'>
              {post.ingredients}
            </h6>
            <div className='labels'>Instructions</div>
            <h6 className='labels__info'>
              {post.instructions}
            </h6>
            <div className='labels'>Notes</div>
            <h6 className='labels__info'>
              {post.notes}
            </h6>
          </div>

          {/* Update and Delete Post Button */}
          <Button onClick={this.updatePostClicked} variant="primary">Update</Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.onPostDelete} variant="outline-danger">Delete</Button>

          {/* Comments Display */}
          <h4 style={{ marginTop: '50px', marginLeft: '45px' }}>Comments:</h4>
          <div className="showCommentContainer">
            <ul>
              {commentsJsx}
              <CreateComment
                user={user}
                post={post}
                msgAlert={msgAlert}
                addNewComment={this.addNewComment}
              />
            </ul>
          </div>
        </div>
      )
    }

    // update comment (includes modal)
    if (showUpdateCommentModal) {
      return (
        <div>
          <Modal
            show={showUpdateCommentModal}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header style={{ backgroundColor: '#006400' }} closeButton>
              <Modal.Title style={{ color: 'white' }}>Update Your Comment!</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'white' }}>
              <Form onSubmit={(event) => {
                this.handleUpdate(commentId, event)
              }}>
                <Form.Group controlId="formBasicContent">
                  <Form.Label style={{ fontSize: '25px' }}>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    placeholder="Update comment here"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button style={{ marginRight: '10px' }} variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      )
    }

    return (
      <div>
        {showDisplay}
      </div>
    )
  }
}

export default withRouter(PostShow)
