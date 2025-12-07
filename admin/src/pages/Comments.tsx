import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Input,
  Select,
  Card,
  Divider,
  Descriptions,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { apiService } from "../services/api";
import { Comment } from "../types";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

interface CommentsResponse {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
}

const Comments: React.FC = () => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();

  // 获取评论列表
  const { data: commentsData, isLoading } = useQuery<CommentsResponse>(
    [
      "comments",
      pagination.current,
      pagination.pageSize,
      statusFilter,
      searchText,
    ],
    () =>
      apiService.getComments({
        page: pagination.current,
        limit: pagination.pageSize,
        status: statusFilter,
        keyword: searchText,
      }),
    {
      keepPreviousData: true,
    }
  );

  console.log("commentsData", commentsData?.data);

  // 获取待审核评论数量
  const { data: pendingStats } = useQuery("pending-comments-count", () =>
    apiService.getPendingComments().then((data) => data.length || 0)
  );

  // 审核通过
  const approveMutation = useMutation(
    (id: number) => apiService.approveComment(id),
    {
      onSuccess: () => {
        message.success("评论审核通过");
        queryClient.invalidateQueries("comments");
        queryClient.invalidateQueries("pending-comments-count");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "操作失败");
      },
    }
  );

  // 审核拒绝
  const rejectMutation = useMutation(
    (id: number) => apiService.rejectComment(id),
    {
      onSuccess: () => {
        message.success("评论已拒绝");
        queryClient.invalidateQueries("comments");
        queryClient.invalidateQueries("pending-comments-count");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "操作失败");
      },
    }
  );

  // 删除评论
  const deleteMutation = useMutation(
    (id: number) => apiService.deleteComment(id),
    {
      onSuccess: () => {
        message.success("评论删除成功");
        queryClient.invalidateQueries("comments");
        queryClient.invalidateQueries("pending-comments-count");
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "删除失败");
      },
    }
  );

  // 查看详情
  const handleViewDetail = (record: Comment) => {
    setSelectedComment(record);
    setDetailModalVisible(true);
  };

  // 审核通过
  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  // 审核拒绝
  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  // 删除评论
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      width: 300,
      render: (text: string) => (
        <div>
          <div style={{ fontSize: "14px", lineHeight: "1.4" }}>{text}</div>
        </div>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
      width: 120,
      render: (author: string, record: Comment) => (
        <div>
          <div
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <UserOutlined style={{ fontSize: "12px", color: "#666" }} />
            {author}
          </div>
          {record.email && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              <MailOutlined style={{ fontSize: "10px", marginRight: "4px" }} />
              {record.email}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          PENDING: { color: "orange", text: "待审核" },
          APPROVED: { color: "green", text: "已通过" },
          REJECTED: { color: "red", text: "已拒绝" },
        };
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig["PENDING"];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "关联文章",
      dataIndex: "article",
      key: "article",
      width: 180,
      render: (article: { title: string; slug: string }) => (
        <div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {article.title}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>{article.slug}</div>
        </div>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (record: Comment) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>

          {record.status === "PENDING" && (
            <>
              <Tooltip title="审核通过">
                <Popconfirm
                  title="确定要通过这条评论吗？"
                  onConfirm={() => handleApprove(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    size="small"
                    loading={approveMutation.isLoading}
                    style={{ color: "#52c41a" }}
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="审核拒绝">
                <Popconfirm
                  title="确定要拒绝这条评论吗？"
                  onConfirm={() => handleReject(record.id)}
                  okText="确定"
                  cancelText="取消"
                  okType="danger"
                >
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    loading={rejectMutation.isLoading}
                    danger
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}

          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这条评论吗？删除后无法恢复。"
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

  const pendingCount = pendingStats || 0;

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
        <div>
          <Title level={2} style={{ margin: 0 }}>
            评论管理
            {pendingCount > 0 && (
              <Tag
                color="orange"
                style={{ marginLeft: "12px", fontSize: "12px" }}
              >
                {pendingCount} 条待审核
              </Tag>
            )}
          </Title>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>状态筛选:</span>
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPagination({ ...pagination, current: 1 });
              }}
              style={{ width: 120 }}
              allowClear
              placeholder="全部状态"
            >
              <Option value="PENDING">待审核</Option>
              <Option value="APPROVED">已通过</Option>
              <Option value="REJECTED">已拒绝</Option>
            </Select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <Search
              placeholder="搜索评论内容或作者"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => {
                setPagination({ ...pagination, current: 1 });
              }}
              style={{ width: "100%" }}
              allowClear
            />
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={commentsData?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: commentsData?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 10 });
          },
        }}
      />

      {/* 详情模态框 */}
      <Modal
        title="评论详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedComment(null);
        }}
        footer={null}
        width={600}
      >
        {selectedComment && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions title="作者信息" column={1} size="small">
                <Descriptions.Item label="昵称">
                  {selectedComment.author}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  <span style={{ color: "#1890ff" }}>
                    {selectedComment.email}
                  </span>
                </Descriptions.Item>
                {selectedComment.website && (
                  <Descriptions.Item label="网站">
                    <a
                      href={selectedComment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedComment.website}
                    </a>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="状态">
                  <Tag
                    color={
                      selectedComment.status === "PENDING"
                        ? "orange"
                        : selectedComment.status === "APPROVED"
                          ? "green"
                          : "red"
                    }
                  >
                    {selectedComment.status === "PENDING"
                      ? "待审核"
                      : selectedComment.status === "APPROVED"
                        ? "已通过"
                        : "已拒绝"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions title="评论信息" column={1} size="small">
                <Descriptions.Item label="关联文章">
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {selectedComment.article.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {selectedComment.article.slug}
                    </div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="评论时间">
                  {new Date(selectedComment.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="最后更新">
                  {new Date(selectedComment.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small">
              <Descriptions title="评论内容" column={1} size="small">
                <Descriptions.Item label="内容">
                  <div
                    style={{
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedComment.content}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            <div style={{ textAlign: "right" }}>
              <Space>
                {selectedComment.status === "PENDING" && (
                  <>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        handleApprove(selectedComment.id);
                        setDetailModalVisible(false);
                      }}
                      loading={approveMutation.isLoading}
                    >
                      审核通过
                    </Button>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => {
                        handleReject(selectedComment.id);
                        setDetailModalVisible(false);
                      }}
                      loading={rejectMutation.isLoading}
                    >
                      审核拒绝
                    </Button>
                  </>
                )}
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleDelete(selectedComment.id);
                    setDetailModalVisible(false);
                  }}
                  loading={deleteMutation.isLoading}
                >
                  删除评论
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Comments;
