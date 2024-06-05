import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Form, Input, Menu, message, Modal } from "antd";
import {
  DatabaseOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUser } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookieUtils";
import { login } from "../../utils/api/userAuthApi";
import { getUserById } from "../../utils/api/getApi";
import "./Navbar.css";

const RightMenu = ({ mode, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { user, setUser } = useUser();
  const [openRightMenu, setOpenRightMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const sessionToken = getCookie("sessionToken");
    if (sessionToken) {
      getUserById(sessionToken, setUser);
    }
  }, [setUser]);

  useEffect(() => {
    if (!authenticated) {
      setUser(null);
    }
  }, [authenticated, setUser]);

  const loginError = (title) => {
    messageApi.open({
      type: "error",
      content: `${title}`,
    });
  };

  const onSignIn = async (values) => {
    setLoadingSignIn(true);
    try {
      const accessToken = await login(values);
      setCookie("sessionToken", accessToken);
      getUserById(accessToken, setUser);
      setAuthenticated(true);
      setIsModalOpen(false);
      setOpenRightMenu(false);
    } catch (error) {
      loginError(error.response.data.message);
    }
    setLoadingSignIn(false);
  };

  const onSignOut = () => {
    deleteCookie("sessionToken");
    setAuthenticated(false);
    navigate("/");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setOpenRightMenu(!openRightMenu);
  };

  const handleSettingsClick = () => {
    setOpenRightMenu(false);
    navigate("/settings");
  };

  const handleManageDataclick = () => {
    setOpenRightMenu(false);
    navigate("/manage-metadata");
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenRightMenu(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderRightMenu = () => {
    if (authenticated) {
      if (mode === "horizontal") {
        return (
          <div ref={dropdownRef} className="rm-h-dropdown">
            {contextHolder}
            <Avatar
              className="rm-h-btn"
              size={35}
              icon={<UserOutlined />}
              onClick={toggleDropdown}
            />
            <div
              className={
                openRightMenu
                  ? "rm-h-dropdown-content show"
                  : "rm-h-dropdown-content"
              }
            >
              <div className="rm-h-profile">
                {user && (
                  <span className="rm-h-role">
                    {user.role_name === "Admin"
                      ? "Administrator"
                      : user.role_name}
                  </span>
                )}
                <Avatar
                  className="rm-h-avatar"
                  size={55}
                  icon={<UserOutlined />}
                />
                {user && (
                  <div className="rm-h-user-details">
                    <span className="rm-h-name">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="rm-h-email">{user.email}</span>
                  </div>
                )}
              </div>

              <div className="rm-h-options">
                {user && user.role_name === "Admin" ? (
                  <div className="rm-h-manage">
                    <Button
                      className={`rm-h-manage-btn ${
                        isActive("/manage-metadata") ? "active" : ""
                      }`}
                      onClick={handleManageDataclick}
                    >
                      <DatabaseOutlined /> Manage Metadata
                    </Button>
                  </div>
                ) : null}
                <div className="rm-h-settings">
                  <Button
                    className={`rm-h-settings-btn ${
                      isActive("/settings") ? "active" : ""
                    }`}
                    onClick={handleSettingsClick}
                  >
                    <SettingOutlined /> Settings
                  </Button>
                  <Button onClick={onSignOut}>
                    <LogoutOutlined /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <Menu mode="inline" onClick={onClose}>
            {contextHolder}
            <Menu.SubMenu
              title={
                <div className="rm-i-title">
                  <Avatar
                    className="rm-i-avatar"
                    size={35}
                    icon={<UserOutlined />}
                  />
                  {user && (
                    <div className="rm-i-username">
                      <span>
                        {user.first_name} {user.last_name}
                      </span>
                      <span>
                        (
                        {user.role_name === "Admin"
                          ? "Administrator"
                          : user.role_name}
                        )
                      </span>
                    </div>
                  )}
                </div>
              }
            >
              <Menu.Item key="manage-data" onClick={handleManageDataclick}>
                <DatabaseOutlined />
                &ensp; Manage Data
              </Menu.Item>
              <Menu.Item key="settings" onClick={handleSettingsClick}>
                <SettingOutlined />
                &ensp; Settings
              </Menu.Item>
              <Menu.Item key="sign-out" onClick={onSignOut}>
                <LogoutOutlined />
                &ensp; Sign Out
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        );
      }
    } else {
      return (
        <>
          {contextHolder}
          <span className={"rm-signin-text " + mode} onClick={showModal}>
            {" "}
            Sign In{" "}
          </span>
          <Modal
            className="sign-in-modal-container"
            centered
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={450}
          >
            <div className="sign-in-modal">
              <img src="/images/logo.png" alt="logo" className="sign-in-logo" />
              <span className="sign-in-modal-title">
                Sign in to your account
              </span>
              <Form
                className="sign-in-form"
                name="sign-in-form-right-menu"
                wrapperCol={{ span: 23.5 }}
                style={{
                  maxWidth: 600,
                }}
                autoComplete="off"
                onFinish={onSignIn}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Username"
                  />
                </Form.Item>
                <Form.Item
                  className="password-field"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="sign-in-btn"
                    type="primary"
                    loading={loadingSignIn}
                    htmlType="submit"
                    size="large"
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </>
      );
    }
  };

  return renderRightMenu();
};

export default RightMenu;
