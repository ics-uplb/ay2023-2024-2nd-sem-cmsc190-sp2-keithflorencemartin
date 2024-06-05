import axios from "axios";
import { jwtDecode } from "jwt-decode";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// API helpers for fetching all caves, collections, hosts, institutions,
// locations, methods, organisms, samples, and sampling points
export const getAll = async (model, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${backendUrl}/${model}/`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API helper for fetching all users
export const getAllUsers = async (accessToken, setUsers) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${backendUrl}/user/`, config);
    setUsers(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// API helper for fetching all isolates
export const getAllIsolates = async (acessToken, setIsolates) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${acessToken}`,
      },
    };
    const response = await axios.get(`${backendUrl}/isolate/`, config);

    if (setIsolates) {
      setIsolates(response.data.isolates);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching isolates:", error);
    throw error;
  }
};

export const getUserById = async (accessToken, setUser) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        role_name: decodedToken.role_name,
      },
    };
    const userResponse = await axios.get(
      `${backendUrl}/user/${decodedToken.id}`,
      config
    );
    setUser(userResponse.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// API helper for fetching an isolate by its id
export const getIsolateById = async (accessToken, isolateId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/isolate/${isolateId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API helper for fetching an isolate/s by its keyword
export const getIsolateByKeyword = async (
  accessToken,
  keywords,
  searchOption
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {},
    };

    if (searchOption === "accession_no") {
      config.params.accession_no = keywords.accession_no;
    } else {
      config.params.genus = keywords.genus;
      config.params.species = keywords.species;
    }

    const response = await axios.get(`${backendUrl}/isolate/search`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
