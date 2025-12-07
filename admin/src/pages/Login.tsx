import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { apiService } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { LoginRequest, RegisterRequest } from "../types";

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const loginMutation = useMutation(
    ({ username, password }: { username: string; password: string }) =>
      apiService.login(username, password),
    {
      onSuccess: (data) => {
        login(data.user, data.token);
        message.success("登录成功");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "登录失败");
      },
    }
  );

  const registerMutation = useMutation(
    (userData: any) => apiService.register(userData),
    {
      onSuccess: () => {
        message.success("注册成功，请登录");
        setActiveTab("login");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "注册失败");
      },
    }
  );

  const onLoginFinish = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  const onRegisterFinish = (values: RegisterRequest) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1 className="login-title">KBlog Admin</h1>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="登录" key="login">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onLoginFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loginMutation.isLoading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="注册" key="register">
            <Form name="register" onFinish={onRegisterFinish} size="large">
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "请输入密码" },
                  { min: 6, message: "密码至少6位" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "请确认密码" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("密码不一致"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认密码"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={registerMutation.isLoading}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
