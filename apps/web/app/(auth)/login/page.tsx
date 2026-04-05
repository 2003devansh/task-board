"use client";

import { Form, Input, Button, message } from "antd";
import { apiFetch } from "../../../lib/api";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: LoginForm) => {
    try {
      const res = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      localStorage.setItem("token", res.token);

      message.success("Login successful");
      window.location.href = "/dashboard";
    } catch (err: any) {
      message.error(err.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </div>
  );
}
