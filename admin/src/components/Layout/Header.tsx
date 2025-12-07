import React from "react";
import { Layout, Dropdown, Avatar, Space, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { apiService } from "../../services/api";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: "0 24px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 256,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "600" }}>
        欢迎回来，{user?.username}
      </div>
      <Space>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <Button
            type="text"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
            }}
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ marginRight: 8 }}
            />
            {user?.username}
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
