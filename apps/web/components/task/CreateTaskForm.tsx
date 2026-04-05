"use client";

import { Form, Input, Button, message } from "antd";
import { TaskTypes } from "../../features/task/types";
import { createTask } from "../../features/task/api";

export default function CreateTaskForm({
  tasks,
  setTasks,
}: {
  tasks: TaskTypes[];
  setTasks: React.Dispatch<React.SetStateAction<TaskTypes[]>>;
}) {
  const [form] = Form.useForm();

  const onFinish = async (values: { title: string; description: string }) => {
    try {
      const res = await createTask(values);

      setTasks([...tasks, res.task]);

      message.success("Task created!");
      form.resetFields();
    } catch (err: any) {
      message.error(err.message || "Failed to create task");
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Create Task</h3>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Create Task
        </Button>
      </Form>
    </div>
  );
}
