import React, { useState } from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Image,
  Button,
  Space,
  Typography,
  message,
  Tooltip,
  Card,
  Row,
  Col,
  Statistic,
  Badge
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TagOutlined,
  MessageOutlined,
  FileTextOutlined,
  ShareAltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiService } from '../../services/api';
import { Article } from '../../types';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

const { Title, Paragraph, Text } = Typography;

interface ArticleDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  articleId?: number;
  onEdit?: (article: Article) => void;
  onDelete?: (id: number) => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  visible,
  onCancel,
  articleId,
  onEdit,
  onDelete
}) => {
  const [activeView, setActiveView] = useState<'detail' | 'content' | 'raw'>('detail');
  const queryClient = useQueryClient();

  // 获取文章详情
  const { data: article, error, isError } = useQuery(
    ['article', articleId],
    () => apiService.getArticle(articleId!),
    {
      enabled: visible && !!articleId,
      onError: (error: any) => {
        console.error('获取文章详情失败:', error);
        message.error(error.response?.data?.message || '获取文章详情失败');
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
        onCancel();
        onDelete?.(articleId!);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '删除失败');
      }
    }
  );

  const handleDelete = () => {
    if (article) {
      deleteMutation.mutate(article.id);
    }
  };

  const handleEdit = () => {
    if (article) {
      onEdit?.(article);
      onCancel();
    }
  };

  const handleShare = () => {
    if (article) {
      const url = `${window.location.origin}/articles/${article.slug}`;
      navigator.clipboard.writeText(url).then(() => {
        message.success('链接已复制到剪贴板');
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED' ? 'green' : 'orange';
  };

  const getStatusText = (status: string) => {
    return status === 'PUBLISHED' ? '已发布' : '草稿';
  };

  if (!visible || !articleId) return null;

  if (isError) {
    return (
      <Modal
        title="文章详情"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            关闭
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Typography.Text type="danger">
            {error?.response?.data?.message || '获取文章详情失败'}
          </Typography.Text>
        </div>
      </Modal>
    );
  }

  const articleData = article as Article;

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>文章详情</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="back" onClick={onCancel}>
          关闭
        </Button>,
        <Button
          key="share"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
        >
          分享
        </Button>,
        <Button
          key="edit"
          type="default"
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          编辑
        </Button>,
        <Tooltip title="删除后不可恢复">
          <Button
            key="delete"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deleteMutation.isLoading}
          >
            删除
          </Button>
        </Tooltip>
      ]}
      destroyOnClose
    >
      {articleData ? (
        <div>
          {/* 视图切换标签 */}
          <div style={{ marginBottom: '24px' }}>
            <Button.Group>
              <Button
                type={activeView === 'detail' ? 'primary' : 'default'}
                icon={<FileTextOutlined />}
                onClick={() => setActiveView('detail')}
              >
                详情信息
              </Button>
              <Button
                type={activeView === 'content' ? 'primary' : 'default'}
                icon={<EyeOutlined />}
                onClick={() => setActiveView('content')}
              >
                内容预览
              </Button>
              <Button
                type={activeView === 'raw' ? 'primary' : 'default'}
                icon={<FileTextOutlined />}
                onClick={() => setActiveView('raw')}
              >
                Markdown源码
              </Button>
            </Button.Group>
          </div>

          {/* 详情视图 */}
          {activeView === 'detail' && (
            <div>
              {/* 文章头部信息 */}
              <Card style={{ marginBottom: '16px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Title level={3} style={{ marginBottom: '12px' }}>
                      {articleData.title}
                      <Badge
                        status={articleData.status === 'PUBLISHED' ? 'success' : 'warning'}
                        text={getStatusText(articleData.status)}
                        style={{ marginLeft: '12px' }}
                      />
                    </Title>
                    {articleData.summary && (
                      <Paragraph type="secondary" style={{ fontSize: '16px' }}>
                        {articleData.summary}
                      </Paragraph>
                    )}
                  </Col>

                  {articleData.coverImage && (
                    <Col span={24}>
                      <Image
                        src={articleData.coverImage}
                        alt={articleData.title}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                        fallback="/placeholder.png"
                      />
                    </Col>
                  )}

                  <Col span={24}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="浏览量"
                          value={articleData.viewCount}
                          prefix={<EyeOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="评论数"
                          value={articleData._count?.comments || 0}
                          prefix={<MessageOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="标签数"
                          value={articleData.tags?.length || 0}
                          prefix={<TagOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="状态"
                          value={getStatusText(articleData.status)}
                          prefix={<Badge color={getStatusColor(articleData.status)} />}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              {/* 详细信息 */}
              <Descriptions
                title="基本信息"
                bordered
                column={2}
                size="small"
              >
                <Descriptions.Item label="文章ID">
                  {articleData.id}
                </Descriptions.Item>
                <Descriptions.Item label="文章别名">
                  <Text code>{articleData.slug}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="发布状态">
                  <Tag color={getStatusColor(articleData.status)}>
                    {getStatusText(articleData.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="是否已发布">
                  <Badge status={articleData.isPublished ? 'success' : 'default'} />
                  <span style={{ marginLeft: '8px' }}>
                    {articleData.isPublished ? '是' : '否'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={2}>
                  <Space>
                    <CalendarOutlined />
                    <Text>{formatDate(articleData.createdAt)}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" span={2}>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>{formatDate(articleData.updatedAt)}</Text>
                  </Space>
                </Descriptions.Item>
                {articleData.publishedAt && (
                  <Descriptions.Item label="发布时间" span={2}>
                    <Space>
                      <CalendarOutlined />
                      <Text>{formatDate(articleData.publishedAt)}</Text>
                    </Space>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* 标签信息 */}
              {articleData.tags && articleData.tags.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <Title level={5}>
                    <TagOutlined /> 相关标签
                  </Title>
                  <Space wrap>
                    {articleData.tags.map((articleTag) => (
                      <Tag
                        key={articleTag.id}
                        color={articleTag.tag.color}
                        style={{ marginBottom: '8px' }}
                      >
                        {articleTag.tag.name}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </div>
          )}

          {/* 内容预览视图 */}
          {activeView === 'content' && (
            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
              <div className="markdown-preview">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }: any) => (
                      <Title level={1}>{children}</Title>
                    ),
                    h2: ({ children }: any) => (
                      <Title level={2}>{children}</Title>
                    ),
                    h3: ({ children }: any) => (
                      <Title level={3}>{children}</Title>
                    ),
                    p: ({ children }: any) => (
                      <Paragraph>{children}</Paragraph>
                    ),
                    code: ({ node, inline, children, className, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <Text code {...props}>
                          {children}
                        </Text>
                      );
                    }
                  }}
                >
                  {articleData.content || '暂无内容'}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Markdown源码视图 */}
          {activeView === 'raw' && (
            <div>
              <pre
                style={{
                  backgroundColor: '#f6f8fa',
                  padding: '16px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '500px',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              >
                <code>{articleData.content || '暂无内容'}</code>
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Typography.Text type="secondary">加载中...</Typography.Text>
        </div>
      )}
    </Modal>
  );
};

export default ArticleDetailModal;