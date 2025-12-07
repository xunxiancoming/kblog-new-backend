import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag as AntTag,
  Image,
  Tooltip,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiService } from '../services/api';
import { Article, ArticleTag } from '../types';
import RichTextEditor from '../components/RichTextEditor';
import TagSelector from '../components/TagSelector';
import ArticleDetailModal from '../components/ArticleDetailModal';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

const Articles: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | undefined>();
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();

  // 获取文章列表
  const { data: articlesData, isLoading } = useQuery<ArticlesResponse>(
    ['articles', pagination.current, pagination.pageSize],
    () => apiService.getArticles({
      page: pagination.current,
      limit: pagination.pageSize
    }),
    {
      keepPreviousData: true
    }
  );

  // 创建文章
  const createMutation = useMutation(
    (data: any) => apiService.createArticle(data),
    {
      onSuccess: () => {
        message.success('文章创建成功');
        setIsModalVisible(false);
        form.resetFields();
        queryClient.invalidateQueries('articles');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '创建失败');
      }
    }
  );

  // 更新文章
  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateArticle(id, data),
    {
      onSuccess: () => {
        message.success('文章更新成功');
        setIsModalVisible(false);
        setEditingArticle(null);
        form.resetFields();
        queryClient.invalidateQueries('articles');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      }
    }
  );

  // 删除文章
  const deleteMutation = useMutation(
    (id: number) => apiService.deleteArticle(id),
    {
      onSuccess: () => {
        message.success('文章删除成功');
        queryClient.invalidateQueries('articles');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '删除失败');
      }
    }
  );

  // 打开新建模态框
  const handleCreate = () => {
    setEditingArticle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (record: Article) => {
    setEditingArticle(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      summary: record.summary,
      coverImage: record.coverImage,
      status: record.status,
      tagIds: record.tags?.map(tag => tag.tagId)
    });
    setIsModalVisible(true);
  };

  // 打开详情模态框
  const handleView = (id: number) => {
    setSelectedArticleId(id);
    setDetailModalVisible(true);
  };

  // 关闭详情模态框
  const handleDetailCancel = () => {
    setDetailModalVisible(false);
    setSelectedArticleId(undefined);
  };

  // 从详情模态框编辑文章
  const handleEditFromDetail = (article: Article) => {
    handleEdit(article);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingArticle) {
        updateMutation.mutate({ id: editingArticle.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // 删除文章
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: Article) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          {record.summary && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {record.summary}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '封面',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 100,
      render: (url: string) =>
        url ? (
          <Image
            width={60}
            height={40}
            src={url}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            fallback="/placeholder.png"
          />
        ) : (
          <div style={{ width: 60, height: 40, background: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileTextOutlined style={{ color: '#ccc' }} />
          </div>
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <AntTag color={status === 'PUBLISHED' ? 'green' : 'orange'}>
          {status === 'PUBLISHED' ? '已发布' : '草稿'}
        </AntTag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '评论数',
      key: 'comments',
      width: 80,
      render: (record: Article) => record._count?.comments || 0,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: ArticleTag[]) => (
        <div>
          {tags?.map(articleTag => (
            <AntTag key={articleTag.id} style={{ marginBottom: '4px' }}>
              {articleTag.tag.name}
            </AntTag>
          ))}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (record: Article) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
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
              title="确定要删除这篇文章吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>文章管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建文章
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={articlesData?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: articlesData?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 10 });
          }
        }}
      />

      <Modal
        title={editingArticle ? '编辑文章' : '新建文章'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingArticle(null);
          form.resetFields();
          setIsMarkdownMode(true);
        }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'DRAFT' }}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            label="文章摘要"
            name="summary"
          >
            <TextArea
              rows={3}
              placeholder="请输入文章摘要（可选）"
            />
          </Form.Item>

          <Form.Item
            label="封面图片URL"
            name="coverImage"
          >
            <Input placeholder="请输入封面图片URL（可选）" />
          </Form.Item>

          <Form.Item
            label="标签关联"
            name="tagIds"
          >
            <TagSelector
              placeholder="请选择或创建标签"
              maxTags={8}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                文章内容
                <Switch
                  checkedChildren="Markdown"
                  unCheckedChildren="富文本"
                  checked={isMarkdownMode}
                  onChange={setIsMarkdownMode}
                  size="small"
                />
              </Space>
            }
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {isMarkdownMode ? (
              <RichTextEditor
                placeholder="请输入Markdown格式的文章内容"
                height={400}
              />
            ) : (
              <TextArea
                rows={12}
                placeholder="请输入文章内容（支持HTML格式）"
              />
            )}
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
          >
            <Select>
              <Option value="DRAFT">草稿</Option>
              <Option value="PUBLISHED">发布</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingArticle(null);
                  form.resetFields();
                  setIsMarkdownMode(true);
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingArticle ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 文章详情弹窗 */}
      <ArticleDetailModal
        visible={detailModalVisible}
        onCancel={handleDetailCancel}
        articleId={selectedArticleId}
        onEdit={handleEditFromDetail}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
};

export default Articles;