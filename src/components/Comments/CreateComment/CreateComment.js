import React, { useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { createComment } from '../../../api/comments'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CreateComment = props => {
  const [content, setContent] = useState('')

  const handleChange = event => {
    event.persist()
    setContent(prevComment => {
      const updatedField = { [event.target.name]: event.target.value }

      const editComment = Object.assign({}, prevComment, updatedField)
      return editComment
    })
  }

  async function handleSubmit (event) {
    event.preventDefault()
    event.target.reset()

    const { msgAlert, user, post, addNewComment } = props
    const postId = post._id

    try {
      const res = await createComment(content, user, postId)
      await addNewComment(res.data.newComment)
      msgAlert({
        heading: 'Comment Created!',
        variant: 'success'
      })
    } catch (error) {
      msgAlert({
        heading: 'Failed to create comment',
        message: `Failed because: ${error.message}`,
        variant: 'danger'
      })
    }
  }

  return (
    <Fragment>
      <Form style={{ marginTop: '10px' }} onSubmit={handleSubmit}>
        <Form.Group controlId="commentContent">
          <Form.Control
            as="textarea"
            multiline="true"
            rows={3}
            columns={3}
            name="content"
            placeholder="Comment Here"
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

export default withRouter(CreateComment)
