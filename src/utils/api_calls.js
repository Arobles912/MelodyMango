export async function fetchUserId(username) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.userId;
      } else {
        console.error("Failed to fetch user ID:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  }


  export async function fetchSpotifyDataByUserId(userId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/spotify-data/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data[0].dataId;
      } else {
        console.error("Failed to fetch data ID:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data ID:", error);
      return null;
    }
  }
  