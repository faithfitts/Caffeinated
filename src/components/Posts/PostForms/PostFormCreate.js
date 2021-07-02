import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const PostFormCreate = ({ post, handleSubmit, handleChange }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="formBasicTitle">
      <Form.Label style={{ marginTop: '30px', fontSize: '20px' }}>Title</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *required</Form.Label>
      <Form.Control
        required
        type="text"
        name="title"
        placeholder="Enter Name of Creation Here"
        oninvalid="this.setCustomValidity"
        // onvalid="this.setCustomValidity('')"
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicPicture">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Image</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *not required</Form.Label>
      <Form.Control
        img="true"
        type="text"
        name="imageURL"
        placeholder="Enter Image URL Here"
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicDescription">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Description</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *required</Form.Label>
      <Form.Control
        required
        as="textarea"
        rows={4}
        name="description"
        placeholder="Enter a Description of Creation Here"
        oninvalid="this.setCustomValidity"
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicIngredients">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Ingredients</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *required</Form.Label>
      <Form.Control
        required
        as="textarea"
        rows={4}
        name="ingredients"
        placeholder="Enter the Ingredients of Creation Here"
        oninvalid="this.setCustomValidity"
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicInstructions">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Instructions</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *required</Form.Label>
      <Form.Control
        required
        as="textarea"
        rows={4}
        name="instructions"
        placeholder="Enter Any Instructions for Creation Here"
        oninvalid="this.setCustomValidity"
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicNotes">
      <Form.Label style={{ marginBottom: '-20px', fontSize: '20px' }}>Notes</Form.Label>
      <Form.Label style={{ fontSize: '15px', color: 'red' }}>&nbsp;&nbsp; *not required</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="notes"
        placeholder="Enter Any Notes Here"
        onChange={handleChange}
      />
    </Form.Group>

    <Button style={{ marginBottom: '30px' }}
      variant="primary"
      type="submit"
    >
      Submit
    </Button>
  </Form>
)
export default PostFormCreate
