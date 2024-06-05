import axios from "axios";
import { jwtDecode } from "jwt-decode";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const updateUser = async (accessToken, values, userId) => {
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

    const response = await axios.patch(
      `${backendUrl}/user/update/${userId}`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (accessToken, values, userId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios.patch(
      `${backendUrl}/user/updatePassword/${userId}`,
      values,
      config
    );
  } catch (error) {
    throw error;
  }
};


export const updateIsolate = async (accessToken, isolateId, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios.patch(
      `${backendUrl}/isolate/update/${isolateId}`,
      values,
      config
    );
  } catch (error) {
    throw error;
  }
};

export const updateMetadata = async (type, accessToken, id, values) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(
      `${backendUrl}/${type}/update/${id}`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
