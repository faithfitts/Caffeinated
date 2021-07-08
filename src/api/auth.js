import apiUrl from '../apiConfig'
import axios from 'axios'

// SignUp
export const signUp = credentials => {
  return axios({
    method: 'POST',
    url: apiUrl + '/sign-up',
    data: {
      credentials: {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation
      }
    }
  })
}

// SignIn
export const signIn = credentials => {
  return axios({
    url: apiUrl + '/sign-in',
    method: 'POST',
    data: {
      credentials: {
        email: credentials.email,
        password: credentials.password
      }
    }
  })
}

// ChangePassword
export const signOut = user => {
  return axios({
    url: apiUrl + '/sign-out',
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

// SignOut
export const changePassword = (passwords, user) => {
  return axios({
    url: apiUrl + '/change-password',
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${user.token}`
    },
    data: {
      passwords: {
        old: passwords.oldPassword,
        new: passwords.newPassword
      }
    }
  })
}
