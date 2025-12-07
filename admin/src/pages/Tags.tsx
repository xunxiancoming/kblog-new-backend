import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  ColorPicker,
  message,
  Popconfirm,
  Tag as AntTag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { apiService } from "../services/api";
import { Tag as TagType } from "../types";

const { Title } = Typography;

const TagsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();

  // 获取标签列表
  const { data: tagsData, isLoading } = useQuery<TagType[]>(
    ["tags"],
    () => apiService.getTags(),
    {
      keepPreviousData: true,
    }
  );

  // 创建标签
  const createMutation = useMutation(
    (data: any) => apiService.createTag(data),
    {
      onSuccess: () => {
        message.success("标签创建成功");
        setIsModalVisible(false);
        form.resetFields();
        queryClient.invalidateQueries("tags");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "创建失败");
      },
    }
  );

  // 更新标签
  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateTag(id, data),
    {
      onSuccess: () => {
        message.success("标签更新成功");
        setIsModalVisible(false);
        setEditingTag(null);
        form.resetFields();
        queryClient.invalidateQueries("tags");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "更新失败");
      },
    }
  );

  // 删除标签
  const deleteMutation = useMutation((id: number) => apiService.deleteTag(id), {
    onSuccess: () => {
      message.success("标签删除成功");
      queryClient.invalidateQueries("tags");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "删除失败");
    },
  });

  // 打开新建模态框
  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (record: TagType) => {
    setEditingTag(record);
    form.setFieldsValue({
      name: record.name,
      color: record.color || "#1890ff",
    });
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    const formValue =
      typeof values.color === "string"
        ? values
        : { ...values, color: values.color.toHexString() };
    try {
      if (editingTag) {
        updateMutation.mutate({ id: editingTag.id, data: formValue });
      } else {
        createMutation.mutate(formValue);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // 删除标签
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "预览",
      dataIndex: "color",
      key: "preview",
      width: 80,
      render: (color: string, record: TagType) => (
        <AntTag color={color || "default"}>{record.name}</AntTag>
      ),
    },
    {
      title: "标签名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "颜色",
      dataIndex: "color",
      key: "color",
      width: 120,
      render: (color: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: color || "#1890ff",
              border: "1px solid #d9d9d9",
            }}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>
            {color || "#1890ff"}
          </span>
        </div>
      ),
    },
    {
      title: "文章数量",
      dataIndex: "_count",
      key: "articles",
      width: 100,
      render: (count: { articles: number }) => (
        <span style={{ color: count.articles > 0 ? "#1890ff" : "#999" }}>
          {count.articles || 0}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (record: TagType) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个标签吗？删除后，关联的文章将不再包含此标签。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              okType="danger"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleteMutation.isLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          标签管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tagsData}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: tagsData?.length || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 10 });
          },
        }}
      />

      <Modal
        title={editingTag ? "编辑标签" : "新建标签"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTag(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ color: "#1890ff" }}
        >
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: "请输入标签名称" }]}
          >
            <Input placeholder="请输入标签名称" prefix={<TagOutlined />} />
          </Form.Item>

          <Form.Item
            label="标签颜色"
            name="color"
            tooltip="选择标签的颜色，用于前端展示"
          >
            <ColorPicker
              showText
              allowClear
              format="hex"
              presets={[
                {
                  label: "推荐",
                  colors: [
                    "#f50",
                    "#2db7f5",
                    "#87d068",
                    "#108ee9",
                    "#f56a00",
                    "#7265e6",
                    "#ffbf00",
                    "#00a2ae",
                  ],
                },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingTag(null);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingTag ? "更新" : "创建"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsPage;
