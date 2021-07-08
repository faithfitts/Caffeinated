import React, { useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { createReview } from '../../../api/reviews'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CreateReview = props => {
  const [content, setContent] = useState('')

  // Handle updateReview Logic
  const handleChange = event => {
    // ensure the properties are not set to null after handleChange is finished
    event.persist()

    setContent(prevReview => {
      const updatedField = { [event.target.name]: event.target.value }
      const updatedReview = Object.assign({}, prevReview, updatedField)
      return updatedReview
    })
  }

  async function handleSubmit (event) {
    // prevent browser refresh
    event.preventDefault()
    // clear new input field after creating a review
    event.target.reset()

    const { msgAlert, user, post, handleCreateReview } = props
    const postId = post._id

    try {
      // wait for API call
      const res = await createReview(content, user, postId)
      // Wait for logic for creating a new review
      await handleCreateReview(res.data.newReview)
      msgAlert({
        heading: 'Review Created!',
        message: 'Thank You For Leaving A Review!',
        variant: 'success'
      })
    } catch (error) {
      msgAlert({
        heading: 'Failed to create review',
        message: `Failed because: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  return (
    <Fragment>
      <Form style={{ marginTop: '10px' }} onSubmit={handleSubmit}>
        <Form.Group controlId="reviewContent">
          <Form.Control
            as="textarea"
            multiline="true"
            rows={3}
            columns={3}
            name="content"
            placeholder="Add a review here"
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
        >
            Submit
        </Button>
      </Form>

    </Fragment>
  )
}

export default withRouter(CreateReview)
