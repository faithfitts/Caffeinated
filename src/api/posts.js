import apiUrl from '../apiConfig'
import axios from 'axios'

// Create A Creation
export const createPost = (post, user) => {
  return axios({
    url: apiUrl + '/posts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${user.token}`
    },
    data: { post: post }
  })
}

// Index User (Only Show Creations Made by Current User)
export const indexUserPost = user => {
  return axios({
    url: apiUrl + '/posts/user',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

// Index All (Show All Creations by All Users)
export const indexAllPost = user => {
  return axios({
    url: apiUrl + '/posts',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

// Show A Creation
export const showPost = (id, user) => {
  return axios({
    url: apiUrl + '/posts/' + id,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

// Delete A Creation
export const deletePost = (id, user) => {
  return axios({
    url: apiUrl + '/posts/' + id,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

// Update A Creation
export const updatePost = (id, post, user) => {
  return axios({
    url: apiUrl + '/posts/' + id,
    method: 'PATCH',
    data: { post: post },
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}
