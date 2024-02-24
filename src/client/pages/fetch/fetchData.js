import axios from "axios";

async function fetchUsername(setUsername) {
  try {
    const authResponse = await axios.get('http://localhost:5000/api/auth-user', { withCredentials: true });
    if (authResponse.data.authorized) {
      return authResponse.data.username
    } else {
      return ''
    }
  } catch (error) {
    console.error("Failed to fetch username:", error);
    return ''
  }
}

async function fetchUserId() {
  try {
    const authResponse = await axios.get('http://localhost:5000/api/auth-user', { withCredentials: true });
    if (authResponse.data.authorized) {
      return authResponse.data.user_id; 
    } else {
      return ''; 
    }
  } catch (error) {
    console.error("Failed to fetch user_id:", error);
    return '';
  }
}

async function checkAccountMT(username, password, server) {
  try {
    const response = await axios.post('http://localhost:8000/checkaccountmt', {
      username: username,
      password: password,
      server: server,
    });
    if ( response.data.success === true) {
      return response.data;
    } else {
      return response
    }
  } catch (error) {
    return error;
  }
}

export {fetchUsername, fetchUserId, checkAccountMT}