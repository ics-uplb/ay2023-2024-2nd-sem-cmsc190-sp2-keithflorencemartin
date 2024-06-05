import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const deleteUser = async (accessToken, userId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    await axios.delete(`${backendUrl}/user/delete/${userId}`, config);
  } catch (error) {
    throw error;
  }
};


export const deleteIsolate = async (accessToken, isolateIds) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    await axios.delete(`${backendUrl}/isolate/delete`, {
      ...config,
      data: { isolateIds },
    });
  } catch (error) {
    throw error;
  }
};


export const deleteMetadata = async (model, accessToken, id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios.delete(`${backendUrl}/${model}/delete/${id}`, config);
  } catch (error) {
    throw error;
  }
};
