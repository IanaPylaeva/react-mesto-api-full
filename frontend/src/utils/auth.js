const BASE_URL=`${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`;

function checkResponse(res) {
  if(res.ok) {
    return res.json();
  }
  return Promise.reject(res.status);
}

export const registerUser = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export const loginUser = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  }).then(checkResponse);
}