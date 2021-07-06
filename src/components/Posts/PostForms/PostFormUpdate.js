import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const PostFormUpdate = ({ post, handleSubmit, handleChange }) => (
  <Form onSubmit={handleSubmit}>

    {/* Title */}
    <Form.Group controlId="formBasicTitle">
      <Form.Label style={{ marginTop: '30px', fontSize: '20px' }}>Title</Form.Label>
      <Form.Control
        type="text"
        name="title"
        placeholder="Update Name of Creation Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Image */}
    <Form.Group controlId="formBasicPicture">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Image</Form.Label>
      <Form.Control
        img="true"
        type="text"
        name="imageURL"
        placeholder="Update Image URL Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Description */}
    <Form.Group controlId="formBasicDescription">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Description</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="description"
        placeholder="Update a Description of Creation Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Ingredients */}
    <Form.Group controlId="formBasicIngredients">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Ingredients</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="ingredients"
        placeholder="Update the Ingredients of Creation Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Instructions */}
    <Form.Group controlId="formBasicInstructions">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Instructions</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="instructions"
        placeholder="Update Any Instructions for Creation Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Notes */}
    <Form.Group controlId="formBasicNotes">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Notes</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="notes"
        placeholder="Update Notes Here"
        onChange={handleChange}
      />
    </Form.Group>

    {/* Submit Button */}
    <Button style={{ marginBottom: '30px' }}
      variant="primary"
      type="submit"
    >
      Submit
    </Button>
  </Form>
)
export default PostFormUpdate
