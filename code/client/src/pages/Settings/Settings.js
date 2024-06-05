import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import Users from "./Users";
import { useUser } from "../../context/UserContext";
import "./Settings.css";

const { Content, Sider } = Layout;

const items = [
  {
    key: "1",
    icon: <IdcardOutlined />,
    label: "Account",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Users",
  },
];

const Settings = () => {
  const { user } = useUser();
  const [selectedSidebarItem, setSelectedSidebarItem] = React.useState("1");

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item.key);
  };

  return (
    <Layout className="settings-layout">
      <Sider
        className="settings-sider-component"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="settings-sidebar-title">
          <span>Settings</span>
        </div>

        <Menu
          className="settings-sidebar"
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={handleSidebarItemClick}
          items={items.filter((item) => {
            if (user && user.role_name === "Researcher") {
              return item.label === "Account";
            } else if (user && user.role_name === "Admin") {
              return true;
            }
            return false;
          })}
        />
      </Sider>
      <Layout>
        <Content className="settings-content-component">
          <div className="settings-content">
            {selectedSidebarItem === "1" && <Profile />}
            {selectedSidebarItem === "2" && <Users />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Settings;
