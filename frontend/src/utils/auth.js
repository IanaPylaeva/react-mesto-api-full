import {apiSettings} from './const';

function checkResponse(res) {
  if(res.ok) {
    return res.json();
  }
  return Promise.reject(res.status);
}

export const registerUser = (email, password) => {
  return fetch(`${apiSettings.serverUrl}/signup`, {
    method: 'POST',
    headers: apiSettings.headers,
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export const loginUser = (email, password) => {
  return fetch(`${apiSettings.serverUrl}/signin`, {
    method: 'POST',
    headers: apiSettings.headers,
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export const getContent = (token) => {
  return fetch(`${apiSettings.serverUrl}/users/me`, {
    method: 'GET',
    headers: {authorization: 'Bearer ' + localStorage.getItem('jwt'), ...apiSettings.headers},
  }).then(checkResponse);
}