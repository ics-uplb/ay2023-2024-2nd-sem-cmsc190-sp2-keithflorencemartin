import React, { useState, useEffect } from "react";
import { Avatar, Button, Divider, Modal, message, Table, Space } from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import UserModal from "../../components/UserModal/UserModal";
import { deleteUser } from "../../utils/api/deleteApi";
import { getAllUsers } from "../../utils/api/getApi";
import { useUser } from "../../context/UserContext";
import { getCookie } from "../../utils/cookieUtils";
import "./Settings.css";

const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

const UsersSample = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState({});
  const [userToDelete, setUserToDelete] = useState({});
  const [deleteUserErrorMessage, setDeleteUserErrorMessage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const accessToken = getCookie("sessionToken");

  const openModal = (type, record) => {
    if (type === "add") {
      setAddModalOpen(true);
    } else if (type === "update") {
      setUpdateModalOpen(true);
      setRecordToUpdate(record);
    } else {
      setDeleteUserModalOpen(true);
    }
  };

  const closeModal = (type) => {
    if (type === "add") {
      setAddModalOpen(false);
    } else if (type === "update") {
      setUpdateModalOpen(false);
    } else {
      setDeleteUserModalOpen(false);
    }
  };

  const columns = [
    {
      dataIndex: "avatar",
      key: "avatar",
      render: (_, record, index) => (
        <Avatar
          style={{ backgroundColor: ColorList[index % ColorList.length] }}
        >
          {record.first_name.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Researcher", value: "Researcher" },
      ],
      onFilter: (value, record) => record.role_name === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (user && user.username === record.username) {
          return null;
        }

        return (
          <Space size="middle">
            <EditOutlined onClick={() => openModal("update", record)} />
            <DeleteOutlined
              onClick={() => {
                setUserToDelete({
                  id: record.id,
                  name: `${record.first_name} ${record.last_name}`,
                  username: record.username,
                  role_name: record.role_name,
                });
                openModal("delete");
              }}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    setLoadingUsers(true);
    const fetchUsers = async () => {
      await getAllUsers(accessToken, setUsers);
      setLoadingUsers(false);
    };

    fetchUsers();
  }, [accessToken]);

  useEffect(() => {
    if (deleteUserErrorMessage) {
      messageApi.open({
        type: "error",
        content: deleteUserErrorMessage,
      });
    }
  }, [deleteUserErrorMessage, messageApi]);

  const updateUserList = (type, newUser) => {
    if (type === "add") {
      setUsers([...users, newUser]);
    } else {
      setUsers(
        users.map((user) => {
          if (user.id === newUser.id) {
            return newUser;
          }
          return user;
        })
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoadingDeleteUser(true);
    try {
      await deleteUser(accessToken, userId);
      closeModal("delete");
      messageApi.open({
        type: "success",
        content: "User deleted successfully.",
      });
      setUsers(users.filter((user) => user.username !== userToDelete.username));
    } catch (error) {
      setDeleteUserErrorMessage(error);
    }
    setLoadingDeleteUser(false);
  };

  return (
    <div className="users-manage-users-container">
      {contextHolder}
      <UserModal
        type="add"
        open={addModalOpen}
        onCancel={() => closeModal("add")}
        updateUserList={updateUserList}
      />
      <UserModal
        type="update"
        open={updateModalOpen}
        onCancel={() => closeModal("update")}
        updateUserList={updateUserList}
        record={recordToUpdate}
      />
      <Modal
        centered
        open={deleteUserModalOpen}
        onCancel={() => {
          closeModal("delete");
        }}
        width={350}
        footer={[
          <Button
            key="back"
            onClick={() => {
              closeModal("delete");
            }}
          >
            Cancel
          </Button>,
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            loading={loadingDeleteUser}
            onClick={() => {
              handleDeleteUser(userToDelete.id);
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <Space className="modal-wrapper" direction="vertical" align="center">
          <span className="modal-title">Delete user?</span>
          <div className="modal-desc">
            <Divider className="users-top-divider" />
            <span>
              Are you sure you want to delete the user&nbsp;
              <span className="settings-du-modal-name">
                {userToDelete.name}&nbsp;
              </span>
              <span className="settings-du-modal-username">
                ({userToDelete.username})
              </span>
              ? <br /> <br />
              Deleting this user will revoke their{" "}
              <u>{userToDelete.role_name}</u> privileges. This action cannot be
              undone.
            </span>
            <Divider className="users-top-divider" />
          </div>
        </Space>
      </Modal>
      <div className="users-manage-users-title">
        <span className="settings-titles">| Manage Users ({users.length})</span>
        <Button
          className="users-add-users-btn"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => openModal("add")}
        >
          Add Users
        </Button>
      </div>
      <Table
        className="users-table"
        columns={columns}
        dataSource={users}
        loading={loadingUsers}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default UsersSample;
