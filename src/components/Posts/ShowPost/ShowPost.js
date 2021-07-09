import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import CreateReview from './../../Reviews/CreateReview/CreateReview'
import ShowDisplay from './ShowDisplay'

import { showPost, deletePost } from '../../../api/posts'
import { deleteReview, updateReview } from '../../../api/reviews'
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

  // Show Post - Logic (viewing a single post)
  componentDidMount () {
    const { user, match, msgAlert } = this.props

    showPost(match.params.id, user)
      .then(res => {
        // console.log(res)
        this.setState({ post: res.data.post, reviewsList: res.data.post.reviews })
        return res
      })
      .then(res => msgAlert({
        heading: 'Here Is Your Coffee Creation',
        message: `Now Viewing: ${res.data.post.title}`,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Coffee Creation Failed To Load',
          message: `Failed To Show Post with error: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  // Update Post - Clicking the Update Button Logic
  updatePostClicked = (event) => {
    this.setState({ updatePostButtonClicked: true })
  }

  // Deleting Post - Logic
  onPostDelete = () => {
    const { user, match, history, msgAlert } = this.props
    deletePost(match.params.id, user)
      .then(this.setState({ exists: false }))
      .then(() => msgAlert({
        heading: 'Deleted Post Successfully',
        message: 'The Coffee Creation Has Been Deleted.',
        variant: 'success'
      }))
      .then(() => history.push('/index'))
      .catch(error => {
        msgAlert({
          heading: 'Deleting Post Failed',
          message: `Failed To Delete Coffee Creation: ${error.message}`,
          variant: 'danger'
        })
      })
  }

  // Create Review - Logic
  handleCreateReview = (review) => {
    const { match, user } = this.props
    const { post } = this.state

    post.reviews.push(review)

    showPost(match.params.id, user)
      .then(res => this.setState({ post: res.data.post, reviewsList: res.data.post.reviews }))
  }

  // Update Review - Logic for Changing State
  handleChange = event => {
    event.persist()
    this.setState((state) => {
      return {
        content: { ...state.content, [event.target.name]: event.target.value }
      }
    })
  }

  // Update Review - Clicking the Update Review Button
  handleUpdateClicked = (reviewId, event) => {
    this.setState({ updateReviewClicked: true })
    this.setState({ reviewId: reviewId })
    this.setState({ showUpdateReviewModal: true })
  }

  // Update Review - Logic to handle asynchronous calls
  async handleUpdate (reviewIdForAxios, event) {
    // prevent browser refresh
    event.preventDefault()
    // clear new input field after creating a review
    event.target.reset()

    const { msgAlert, user, match } = this.props
    const { post, content } = this.state
    const postId = post._id

    try {
      // wait for Review Update API call
      await updateReview(content, user, postId, reviewIdForAxios)
      // wait for Show Post API call
      const res = await showPost(match.params.id, user)
      // wait for the post data and the review array
      await this.setState({ post: res.data.post, reviewsList: res.data.post.reviews })
      this.setState({ updateReviewClicked: false })
      this.setState({ showUpdateReviewModal: false })
      this.setState({ updatePostButtonClicked: false })
      msgAlert({
        heading: 'Review Update Successful',
        message: 'Your Review Has Been Updated',
        variant: 'success'
      })
    } catch (error) {
      msgAlert({
        heading: 'Failed To Update Review',
        message: `Failed To Update Refview With Error: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  // Update Review - Close Button on Modal
  handleClose = (event) => {
    this.setState({ showUpdateReviewModal: false })
    this.setState({ updateReviewClicked: false })
  }

  // Delete Review - Logic
  handleDeleteReview = (id, event) => {
    this.setState((state) => {
      return { reviewsList: state.reviewsList.filter(cmnt => cmnt._id !== id) }
    })
  }

  // Delete Review - Clicking the Delete Review Button
  async onDeleteReview (reviewId, event) {
    const { user, msgAlert } = this.props
    const { post } = this.state
    const postId = post._id

    try {
      // wait for Delete Review api call
      await deleteReview(reviewId, postId, user)
      // wait for logic for deleting a review
      await this.handleDeleteReview(reviewId, event)
      this.setState({ deleted: true })
    } catch (error) {
      msgAlert({
        heading: 'Review Delete Failed',
        message: `Unable To Delete Review: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  render () {
    const { post, reviewsList, reviewId, updateReviewClicked, showUpdateReviewModal, updatePostButtonClicked } = this.state
    const { msgAlert, user } = this.props

    // Loading
    if (!post) {
      return 'Loading...'
    }

    // Redirect to Update Post
    if (updatePostButtonClicked) {
      return (
        <Redirect to={`/update-post/${post._id}`}/>
      )
    }

    const userId = user._id
    const ownerId = post.owner._id

    let showDisplay

    // Reviews List - current user is NOT the owner of the post
    if (!updateReviewClicked && !showUpdateReviewModal && userId !== ownerId) {
      const reviewsJsx = reviewsList.map(review => (
        <Card key={review._id} className='posts-index-one' style={{ width: '100%', marginTop: '10px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '30px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {review.owner.username} said:
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
                    this.onDeleteReview(review._id, event.target)
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
                handleCreateReview={this.handleCreateReview}
              />
            </ul>
          </div>
        </div>
      )

      // Reviews List - current user IS the owner of the post
    } else if (!updateReviewClicked && !showUpdateReviewModal && reviewsList !== null) {
      const reviewsJsx = reviewsList.map(review => (
        <Card key={review._id} className='posts-index-one' style={{ width: '100%', marginTop: '8px', padding: '5px' }}>
          <Card.Body>
            <Card.Text style={{ marginBottom: '20px', color: '#006400', fontSize: '14px', fontWeight: 'bold' }}>
              <span>
                {review.owner.username} said:
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
                    this.onDeleteReview(review._id, event.target)
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
          <Button onClick={this.updatePostClicked} variant="primary">Update Post</Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.onPostDelete} variant="outline-danger">Delete Post</Button>

          {/* Reviews Display */}
          <h4 style={{ marginTop: '50px', marginLeft: '45px' }}>Reviews:</h4>
          <div className="showReviewContainer">
            <ul>
              {reviewsJsx}
              <CreateReview
                user={user}
                post={post}
                msgAlert={msgAlert}
                handleCreateReview={this.handleCreateReview}
              />
            </ul>
          </div>
        </div>
      )
    }

    // Update Review - Modal Form
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

    // Return Show Display
    return (
      <div>
        {showDisplay}
      </div>
    )
  }
}

export default withRouter(PostShow)
