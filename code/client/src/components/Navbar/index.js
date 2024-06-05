import React, { useState, useEffect } from "react";
import { Layout, Button, Divider, Drawer } from "antd";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { MenuOutlined } from "@ant-design/icons";
import "./Navbar.css";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  // Close drawer when window is resized to specified width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 847) {
        setOpenDrawer(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="layout-header">
          <div className="navbar-logo">
            <img src="/images/logowithname.png" alt="Logo" />
          </div>
          <LeftMenu mode={"horizontal"} />

          <Button className="navbar-menu-btn" type="text" onClick={showDrawer}>
            <MenuOutlined />
          </Button>
          <RightMenu mode={"horizontal"} onClose={onClose} />

          <Drawer
            className="drawer-menu"
            title={"CaveIS"}
            placement="right"
            open={openDrawer}
            onClose={onClose}
          >
            <LeftMenu className="lm-inline" mode={"inline"} onClose={onClose} />
            <Divider className="navbar-divider" />
            <RightMenu mode={"inline"} onClose={onClose} />
          </Drawer>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;
