import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Modal, message, Select } from "antd";
import { register } from "../../utils/api/userAuthApi";
import { getCookie } from "../../utils/cookieUtils";
import { updateUser } from "../../utils/api/updateApi";
import "./UserModal.css";

const accessToken = getCookie("sessionToken");

const UserModal = ({ type, open, onCancel, updateUserList, record }) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        username: record.username,
        role_name: record.role_name,
      });
      setUsername(record.username);
    } else {
      form.resetFields();
    }
  }, [form, record]);

  const handleEmailChange = (value) => {
    if (value) {
      setEmail(value);
      const usernameValue = value.split("@")[0];
      setUsername(usernameValue);
    } else {
      setUsername("");
    }
  };

  const handleCloseModal = () => {
    if (type === "add") {
      onCancel();
      form.resetFields();
      setUsername("");
    } else {
      onCancel();
      form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        username: record.username,
        role_name: record.role_name,
      });
    }
  };

  const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let generatedPassword = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    return generatedPassword;
  };

  const showSuccessNotification = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const showErrorNotification = (message, description) => {
    messageApi.open({
      type: "error",
      content: description,
    });
  };

  const handleUpdateUser = async (values) => {
    setLoadingUpdateUser(true);
    const { first_name, last_name, email, role_name } = values;
    const userData = {
      first_name,
      last_name,
      email,
      username: username,
      role_name,
    };

    try {
      const response = await updateUser(accessToken, userData, record.id);
      updateUserList("update", response);
      handleCloseModal();

      messageApi.open({
        type: "success",
        content: "The user has been successfully updated.",
      });
    } catch (error) {
      if (typeof error === "string") {
        showErrorNotification("Error Updating User", error);
      } else if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showErrorNotification(
          "Error Updating User",
          error.response.data.message
        );
      } else {
        showErrorNotification(
          "Error Updating User",
          "An error occurred while updating the user."
        );
      }
    }
    setLoadingUpdateUser(false);
  };

  const handleAddUser = async (values) => {
    setLoadingAddUser(true);
    const { first_name, last_name, role_name } = values;
    const password = generateRandomPassword();

    const userData = {
      first_name,
      last_name,
      username: username,
      email: email,
      password: password,
      role_name,
    };

    try {
      const response = await register(accessToken, userData);
      updateUserList("add", response.user);
      handleCloseModal();
      showSuccessNotification("User added successfully.");
    } catch (error) {
      if (typeof error === "string") {
        showErrorNotification("Error Adding User", error);
      } else if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showErrorNotification("Error Adding User", error.response.data.message);
      } else {
        showErrorNotification(
          "Error Adding User",
          "An error occurred while adding the user."
        );
      }
    }
    setLoadingAddUser(false);
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={handleCloseModal}
      forceRender={true}
      width={470}
      footer={[
        <Button type="default" key="back" onClick={handleCloseModal}>
          Cancel
        </Button>,
        <Button
          type="primary"
          key="submit"
          loading={type === "add" ? loadingAddUser : loadingUpdateUser}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                if (type === "add") {
                  handleAddUser(values);
                } else {
                  handleUpdateUser(values);
                }
              })
              .catch((errorInfo) => {
                console.log("Validation failed:", errorInfo);
              });
          }}
        >
          {type === "add" ? "Add User" : "Save"}
        </Button>,
      ]}
    >
      {contextHolder}
      <span className="users-au-modal-title">
        {type === "add" ? "Add New User" : "Edit User"}
      </span>
      <Divider className="users-top-divider" />
      <Form
        className="users-form"
        form={form}
        initialValues={{ role_name: "Admin" }} // Change this to be dynamic
      >
        <div className="users-au-field">
          <span>Select a Role</span>
          <Form.Item name="role_name">
            <Select
              className="users-au-role-select"
              size="large"
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Researcher", label: "Researcher" },
              ]}
            />
          </Form.Item>
        </div>
        <div className="users-au-names-row">
          <div className="users-au-fname">
            <span>First name</span>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "Please enter a first name" }]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div>
            <span>Last name</span>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "Please enter a last name" }]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
        </div>
        <div className="users-au-field">
          <span>Email</span>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter an email" }]}
          >
            <Input
              name="email"
              size="large"
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={type === "update"}
            />
          </Form.Item>
        </div>
        <div className="users-au-field">
          <span>Username</span>
          <Input
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            size="large"
          />
        </div>
      </Form>
      <Divider />
    </Modal>
  );
};

export default UserModal;
