import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const register = async (accessToken, values) => {
  try {
    const response = await axios.post(`${backendUrl}/register`, values, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (values) => {
  try {
    const response = await axios.post(`${backendUrl}/login`, values);
    return response.data.accessToken;
  } catch (error) {
    throw error;
  }
};
