import React, { useState, useEffect } from "react";
import { Avatar, Button, Form, Input, message } from "antd";
import { useUser } from "../../context/UserContext";
import { getCookie } from "../../utils/cookieUtils";
import { getUserById } from "../../utils/api/getApi";
import { updatePassword, updateUser } from "../../utils/api/updateApi";
import "./Settings.css";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const { user, setUser } = useUser();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const [updateProfileErrorMessage, setUpdateProfileErrorMessage] =
    useState("");
  const [updatePasswordErrorMessage, setUpdatePasswordErrorMessage] =
    useState("");
  const accessToken = getCookie("sessionToken");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      });
    }

    if (updateProfileErrorMessage) {
      messageApi.open({
        type: "error",
        content: `${updateProfileErrorMessage}`,
      });
    }

    if (updatePasswordErrorMessage) {
      messageApi.open({
        type: "error",
        content: `${updatePasswordErrorMessage}`,
      });
    }
  }, [
    user,
    form,
    updateProfileErrorMessage,
    updatePasswordErrorMessage,
    messageApi,
  ]);

  const onSaveProfile = async (values) => {
    setLoadingSignIn(true);
    const decodedToken = jwtDecode(accessToken);
    try {
      await updateUser(accessToken, values, decodedToken.id);
      await getUserDetails(accessToken);
      messageApi.open({
        type: "success",
        content: "Profile successfully updated",
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setUpdateProfileErrorMessage(error.response.data.message);
      } else {
        setUpdateProfileErrorMessage(
          "An error occurred while updating your profile."
        );
      }
    }
    setLoadingSignIn(false);
  };

  const onChangePassword = async (values) => {
    setLoadingUpdatePassword(true);
    const decodedToken = jwtDecode(accessToken);
    try {
      await updatePassword(accessToken, values, decodedToken.id);
      messageApi.open({
        type: "success",
        content: "Password successfully updated",
      });
      passwordForm.resetFields();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setUpdatePasswordErrorMessage(error.response.data.message);
      } else {
        setUpdateProfileErrorMessage(
          "An error occurred while updating your password."
        );
      }
    }
    setLoadingUpdatePassword(false);
  };

  const getUserDetails = async (accessToken) => {
    try {
      await getUserById(accessToken, setUser);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  return (
    <div>
      {contextHolder}
      <span className="settings-titles">| Account Settings</span>
      <div className="centered-profile">
        <div className="profile">
          <div className="profile-picture">
            <div className="settings-profile-titles header profiledetails">
              <span>Profile Details</span>
            </div>
            <Avatar className="settings-profile-avatar" size={110}>
              {user && user.first_name.charAt(0)}
            </Avatar>
            {/*<Button
              className="settings-upload-profile"
              shape="round"
              icon={<UploadOutlined />}
            >
              Upload Picture
            </Button>
            <Button danger className="settings-upload-profile remove" shape="round">
              Remove
            </Button>*/}
            <span className="profile-account">Account Type:</span>
            <span className="profile-account">
              <b>
                {user && user.role_name === "Admin"
                  ? "Administrator"
                  : user && user.role_name}
              </b>
            </span>
          </div>
          <div className="profile-personal-info">
            <div className="settings-profile-titles header">
              <span>Personal Information</span>
            </div>
            <Form
              form={form}
              className="settings-profile-details"
              name="settings-profile-details-form"
              autoComplete="off"
              onFinish={onSaveProfile}
            >
              <div className="profile-personal-information">
                <div className="settings-profile-name">
                  <div className="settings-first-name">
                    <span className="settings-profile-titles">First Name</span>
                    <Form.Item
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your first name!",
                        },
                      ]}
                    >
                      <Input className="settings-name-input" size="large" />
                    </Form.Item>

                    <span className="settings-profile-titles username">
                      Username
                    </span>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input className="settings-name-input" size="large" />
                    </Form.Item>
                  </div>
                  <div className="settings-last-name">
                    <span className="settings-profile-titles">Last Name</span>
                    <Form.Item
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your last name!",
                        },
                      ]}
                    >
                      <Input className="settings-name-input" size="large" />
                    </Form.Item>

                    <span className="settings-profile-titles email">Email</span>
                    <span className="settings-profile-email">
                      {user && user.email}
                    </span>
                  </div>
                </div>
              </div>

              <Form.Item>
                <Button
                  className="settings-profile-save-btn"
                  type="primary"
                  loading={loadingSignIn}
                  htmlType="submit"
                  size="large"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
            <div className="profile-password-settings">
              <div className="settings-profile-titles header">
                <span>Password Settings</span>
              </div>
              <Form
                form={passwordForm}
                className="settings-profile-details"
                name="profile-password-form"
                autoComplete="off"
                onFinish={onChangePassword}
              >
                <div className="settings-profile-name">
                  <div className="settings-first-name">
                    <span className="settings-profile-titles">
                      New Password
                    </span>
                    <Form.Item
                      name="new_password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter a new password!",
                        },
                      ]}
                    >
                      <Input.Password
                        className="settings-password-input"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                  <div className="settings-last-name">
                    <span className="settings-profile-titles">
                      Current Password
                    </span>
                    <Form.Item
                      name="current_password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your current password!",
                        },
                      ]}
                    >
                      <Input.Password
                        className="settings-password-input"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <Form.Item>
                  <Button
                    className="settings-profile-save-btn password"
                    type="primary"
                    loading={loadingUpdatePassword}
                    htmlType="submit"
                    size="large"
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
