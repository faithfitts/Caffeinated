import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import CreateReview from './../../Reviews/CreateReview/CreateReview'
import ShowDisplay from './ShowDisplay'

import { showPost, postDelete } from '../../../api/posts'
import { reviewDestroy, updateReview } from '../../../api/reviews'
import '../../../index.scss'

class PostShow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: null,
      exists: true,
      deleted: false,
      updateReviewClicked: false,
      showUpdateReviewModal: false,
      updatePostButtonClicked: false,
      reviewId: null,
      content: null,
      reviewsList: []
    }
  }

  deleteReview = (id, event) => {
    this.setState((state) => {
      return { reviewsList: state.reviewsList.filter(cmnt => cmnt._id !== id) }
    })
  }

  addNewReview = (review) => {
    const { match, user } = this.props
    const { post } = this.state

    post.reviews.push(review)

    showPost(match.params.id, user)
      .then(res => this.setState({ post: res.data.post, reviewsList: res.data.post.reviews }))
  }

  async reviewDelete (reviewId, event) {
    const { user, msgAlert } = this.props
    const { post } = this.state
    const postId = post._id

    try {
      await reviewDestroy(reviewId, postId, user)
      await this.deleteReview(reviewId, event)
      this.setState({ deleted: true })
    } catch (error) {
      msgAlert({
        heading: 'Review Delete Failed',
        message: `Couldn't Delete Because: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  handleUpdateClicked = (reviewId, event) => {
    this.setState({ updateReviewClicked: true })
    this.setState({ reviewId: reviewId })
    this.setState({ showUpdateReviewModal: true })
  }

  handleClose = (event) => {
    this.setState({ showUpdateReviewModal: false })
    this.setState({ updateReviewClicked: false })
  }

  updatePostClicked = (event) => {
    this.setState({ updatePostButtonClicked: true })
  }

  async handleUpdate (reviewIdForAxios, event) {
    event.preventDefault()
    event.target.reset()

    const { msgAlert, user, match } = this.props
    const { post, content } = this.state
    const postId = post._id

    try {
      await updateReview(content, user, postId, reviewIdForAxios)
      const res = await showPost(match.params.id, user)
      await this.setState({ post: res.data.post, reviewsList: res.data.post.reviews })
      this.setState({ updateReviewClicked: false })
      this.setState({ showUpdateReviewModal: false })
      this.setState({ updatePostButtonClicked: false })
      msgAlert({
        heading: 'Updated Review Successfully!',
        message: 'Your review has been updated',
        variant: 'success'
      })
    } catch (error) {
      msgAlert({
        heading: 'Failed to update review',
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
        this.setState({ post: res.data.post, reviewsList: res.data.post.reviews })
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
    const { post, reviewsList, reviewId, updateReviewClicked, showUpdateReviewModal, updatePostButtonClicked } = this.state
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

    // Review Section
    if (!updateReviewClicked && !showUpdateReviewModal && userId !== ownerId) {
      const reviewsJsx = reviewsList.map(review => (
        <Card key={review._id} className='posts-index-one' style={{ width: '100%', marginTop: '10px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '30px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {review.owner.username} reviewed:
              </span>
            </Card.Text>
            <br/>
            <div style={{ marginTop: '-40px', whiteSpace: 'pre-wrap' }}>
              {review.content}
            </div>

            {/* If the current user is the owner of the review, allow edit and delete */}
            {review.owner._id === user._id
              ? <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={(event) => this.handleUpdateClicked(review._id, event)}
                >
                  Update Review
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  variant='outline-danger'
                  type='button'
                  onClick={(event) => {
                    this.reviewDelete(review._id, event.target)
                  }}>
                  Delete Review
                </Button>
              </div>
              : null }
          </Card.Body>
        </Card>

      ))

      // Show this display if the current user is NOT the owner of the post
      showDisplay = (
        <div>
          <ShowDisplay
            post={post}
          />

          {/* Reviews Display */}
          <h5 style={{ marginTop: '40px' }}>Reviews:</h5>
          <div className="showReviewContainer">
            <ul>
              {reviewsJsx}
              <CreateReview
                user={user}
                post={post}
                msgAlert={msgAlert}
                addNewReview={this.addNewReview}
              />
            </ul>
          </div>
        </div>
      )

      // Reviews Display
    } else if (!updateReviewClicked && !showUpdateReviewModal && reviewsList !== null) {
      const reviewsJsx = reviewsList.map(review => (
        <Card key={review._id} className='posts-index-one' style={{ width: '100%', marginTop: '8px', padding: '5px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '20px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {review.owner.username} reviewed:
              </span>
            </Card.Text>
            <br/>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '-30px', padding: '-20px' }}>
              {review.content}
            </div>

            {/* If the current user is the owner of the review, allow edit and delete */}
            {review.owner._id === user._id
              ? <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={(event) => this.handleUpdateClicked(review._id, event)}
                >
                  Update Review
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  variant='outline-danger'
                  type='button'
                  onClick={(event) => {
                    this.reviewDelete(review._id, event.target)
                  }}>
                  Delete Review
                </Button>
              </div>
              : null }
          </Card.Body>
        </Card>
      ))

      // Show this display if the current user IS the owner of the post
      showDisplay = (
        <div>
          <ShowDisplay
            post={post}
          />

          {/* Update and Delete Post Button */}
          <Button onClick={this.updatePostClicked} variant="primary">Update</Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.onPostDelete} variant="outline-danger">Delete</Button>

          {/* Reviews Display */}
          <h4 style={{ marginTop: '50px', marginLeft: '45px' }}>Reviews:</h4>
          <div className="showReviewContainer">
            <ul>
              {reviewsJsx}
              <CreateReview
                user={user}
                post={post}
                msgAlert={msgAlert}
                addNewReview={this.addNewReview}
              />
            </ul>
          </div>
        </div>
      )
    }

    // Update Review Modal
    if (showUpdateReviewModal) {
      return (
        <div>
          <Modal
            show={showUpdateReviewModal}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header style={{ backgroundColor: '#006400' }} closeButton>
              <Modal.Title style={{ color: 'white' }}>Update Your Review!</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'white' }}>
              <Form onSubmit={(event) => {
                this.handleUpdate(reviewId, event)
              }}>
                <Form.Group controlId="formBasicContent">
                  <Form.Label style={{ fontSize: '25px' }}>Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    placeholder="Update review here"
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
