import React from 'react'
import Card from 'react-bootstrap/Card'

const ShowDisplay = ({ post }) => (
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
  </div>
)

export default ShowDisplay
