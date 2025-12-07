import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { useAuthStore } from "./store/authStore";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import AuthErrorHandler from "./components/AuthErrorHandler";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import Tags from "./pages/Tags";
import Comments from "./pages/Comments";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DebugApi from "./debug";

const { Content } = Layout;

function App() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  // 初始化时设置API服务的token获取器

  // 如果持久化还没完成，显示加载界面
  if (!hasHydrated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "16px",
        }}
      >
        加载中...
      </div>
    );
  }

  // 持久化完成后，检查认证状态
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AuthErrorHandler>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 256px",
              padding: 24,
              background: "#fff",
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/debug" element={<DebugApi />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </AuthErrorHandler>
  );
}

export default App;
