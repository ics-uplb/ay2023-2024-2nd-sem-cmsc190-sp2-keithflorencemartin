import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const createIsolate = async (accessToken, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(
      `${backendUrl}/isolate/create`,
      values,
      config
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createMetadata = async (type, accessToken, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(
      `${backendUrl}/${type}/create`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
