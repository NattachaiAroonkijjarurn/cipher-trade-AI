import axios from "axios";

async function fetchUsername(setUsername) {
    const fetchData = async () => {
      try {
        const authResponse = await axios.get('http://localhost:5000/api/auth-user', { withCredentials: true });
        if (authResponse.data.authorized) {
          setUsername(authResponse.data.username);
        }
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    }
    fetchData();
}

async function fetchUserId() {
  try {
    const authResponse = await axios.get('http://localhost:5000/api/auth-user', { withCredentials: true });
    if (authResponse.data.authorized) {
      return authResponse.data.user_id; // Correctly return user_id
    } else {
      return ''; // Return empty string if not authorized
    }
  } catch (error) {
    console.error("Failed to fetch user_id:", error);
    return ''; // Return empty string on error
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