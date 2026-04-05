"use client";

import { Form, Input, Button, message } from "antd";
import { apiFetch } from "../../../lib/api";

type RegisterForm = {
  email: string;
  password: string;
  workspaceName: string;
};

export default function RegisterPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterForm) => {
    try {
      const res = await apiFetch<{ token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          workspaceName: "Workspace",
        }),
      });

      localStorage.setItem("token", res.token);

      message.success("Registered successfully");
      window.location.href = "/dashboard";
    } catch (err: any) {
      message.error(err.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Register</h2>

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

        <Form.Item
          name="workspaceName"
          label="Workspace Name"
          rules={[{ required: true, message: "Workspace name is required" }]}
        >
          <Input placeholder="Enter workspace name" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form>
    </div>
  );
}
