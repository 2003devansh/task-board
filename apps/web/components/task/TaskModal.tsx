"use client";

import { Modal, Form, Input, Select, Button, message } from "antd";
import { TaskTypes } from "../../features/task/types";
import { apiFetch } from "../../lib/api";

export default function TaskModal({
  task,
  open,
  setOpen,
}: {
  task: TaskTypes;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    try {
      await apiFetch(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      message.success("Task updated");
      setOpen(false);

      window.location.reload();
    } catch (err: any) {
      message.error(err.message || "Failed to update");
    }
  };

  return (
    <Modal
      title="Edit Task"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={task}
        onFinish={handleSave}
      >
        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="todo">Todo</Select.Option>
            <Select.Option value="in_progress">In Progress</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </Modal>
  );
}
