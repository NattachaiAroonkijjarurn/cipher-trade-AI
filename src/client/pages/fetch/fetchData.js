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

async function fetchUserId(setUserId) {
  const fetchData = async () => {
    try {
      const authResponse = await axios.get('http://localhost:5000/api/auth-user', { withCredentials: true });
      if (authResponse.data.authorized) {
        setUserId(authResponse.data.user_id);
      }
    } catch (error) {
      console.error("Failed to fetch user_id:", error);
    }
  }
  fetchData();
}

export {fetchUsername, fetchUserId}