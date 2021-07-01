import axios from 'axios'
import apiUrl from '../apiConfig'

// Create
export const createReview = async (content, user, postId) => {
  return axios({
    url: apiUrl + '/reviews',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${user.token}`
    },
    data: {
      review: {
        content: content.content,
        postId: postId
      }
    }
  })
}

// Update
export const updateReview = async (content, user, postId, reviewId) => {
  return axios({
    url: apiUrl + '/reviews/' + reviewId,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${user.token}`
    },
    data: {
      review: {
        content: content.content,
        postId: postId
      }
    }
  })
}

// Delete
export const reviewDestroy = async (reviewId, postId, user) => {
  return axios({
    url: apiUrl + '/reviews/' + reviewId,
    method: 'DELETE',
    data: {
      review: {
        postId: postId
      }
    },
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}
