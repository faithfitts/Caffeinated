import React, { useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { createReview } from '../../../api/reviews'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CreateReview = props => {
  const [content, setContent] = useState('')

  const handleChange = event => {
    event.persist()
    setContent(prevReview => {
      const updatedField = { [event.target.name]: event.target.value }

      const editReview = Object.assign({}, prevReview, updatedField)
      return editReview
    })
  }

  async function handleSubmit (event) {
    event.preventDefault()
    event.target.reset()

    const { msgAlert, user, post, addNewReview } = props
    const postId = post._id

    try {
      const res = await createReview(content, user, postId)
      await addNewReview(res.data.newReview)
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
