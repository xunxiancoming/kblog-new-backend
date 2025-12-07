import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Image,
  Tooltip,
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ProjectOutlined,
  LinkOutlined,
  GithubOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiService } from '../services/api';
import { Project } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

const Projects: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const queryClient = useQueryClient();

  // 获取项目列表
  const { data: projectsData, isLoading } = useQuery<ProjectsResponse>(
    ['projects', pagination.current, pagination.pageSize, featuredOnly],
    () => apiService.getProjects({
      page: pagination.current,
      limit: pagination.pageSize,
      featured: featuredOnly
    }),
    {
      keepPreviousData: true
    }
  );

  // 创建项目
  const createMutation = useMutation(
    (data: any) => apiService.createProject(data),
    {
      onSuccess: () => {
        message.success('项目创建成功');
        setIsModalVisible(false);
        form.resetFields();
        queryClient.invalidateQueries('projects');
        queryClient.invalidateQueries('project-stats');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '创建失败');
      }
    }
  );

  // 更新项目
  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateProject(id, data),
    {
      onSuccess: () => {
        message.success('项目更新成功');
        setIsModalVisible(false);
        setEditingProject(null);
        form.resetFields();
        queryClient.invalidateQueries('projects');
        queryClient.invalidateQueries('project-stats');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      }
    }
  );

  // 删除项目
  const deleteMutation = useMutation(
    (id: number) => apiService.deleteProject(id),
    {
      onSuccess: () => {
        message.success('项目删除成功');
        queryClient.invalidateQueries('projects');
        queryClient.invalidateQueries('project-stats');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '删除失败');
      }
    }
  );

  // 切换特色项目
  const toggleFeaturedMutation = useMutation(
    ({ id, featured }: { id: number; featured: boolean }) =>
      apiService.updateProject(id, { featured }),
    {
      onSuccess: () => {
        message.success('特色状态更新成功');
        queryClient.invalidateQueries('projects');
        queryClient.invalidateQueries('project-stats');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '操作失败');
      }
    }
  );

  // 打开新建模态框
  const handleCreate = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (record: Project) => {
    setEditingProject(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl,
      projectUrl: record.projectUrl,
      githubUrl: record.githubUrl,
      techStack: record.techStack,
      featured: record.featured
    });
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingProject) {
        updateMutation.mutate({ id: editingProject.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // 删除项目
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // 切换特色状态
  const handleToggleFeatured = (id: number, featured: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured });
  };

  const columns = [
    {
      title: '封面',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url: string) =>
        url ? (
          <Image
            width={80}
            height={60}
            src={url}
            style={{ objectFit: 'cover', borderRadius: '6px' }}
            fallback="/placeholder.png"
          />
        ) : (
          <div style={{
            width: 80,
            height: 60,
            background: '#f0f0f0',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #d9d9d9'
          }}>
            <ProjectOutlined style={{ color: '#ccc', fontSize: '20px' }} />
          </div>
        ),
    },
    {
      title: '项目信息',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {text}
            {record.featured && <StarFilled style={{ color: '#faad14', fontSize: '14px' }} />}
          </div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4', maxHeight: '40px', overflow: 'hidden' }}>
            {record.description}
          </div>
          {record.techStack && (
            <div style={{ marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#999', marginRight: '4px' }}>技术栈:</span>
              <span style={{ fontSize: '12px', color: '#1890ff' }}>{record.techStack}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '链接',
      key: 'links',
      width: 120,
      render: (record: Project) => (
        <Space size="small">
          {record.projectUrl && (
            <Tooltip title="项目链接">
              <a href={record.projectUrl} target="_blank" rel="noopener noreferrer">
                <LinkOutlined style={{ color: '#1890ff' }} />
              </a>
            </Tooltip>
          )}
          {record.githubUrl && (
            <Tooltip title="GitHub链接">
              <a href={record.githubUrl} target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{ color: '#000' }} />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '特色',
      dataIndex: 'featured',
      key: 'featured',
      width: 80,
      render: (featured: boolean, record: Project) => (
        <Switch
          checked={featured}
          onChange={(checked) => handleToggleFeatured(record.id, checked)}
          checkedChildren={<StarFilled />}
          unCheckedChildren={<StarOutlined />}
          size="small"
          loading={toggleFeaturedMutation.isLoading}
        />
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
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (record: Project) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
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
              title="确定要删除这个项目吗？"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>作品管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建作品
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>筛选:</span>
            <Switch
              checked={featuredOnly}
              onChange={setFeaturedOnly}
              checkedChildren="特色项目"
              unCheckedChildren="全部项目"
              size="small"
            />
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            共 {projectsData?.total || 0} 个项目
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={projectsData?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: projectsData?.total,
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
        title={editingProject ? '编辑作品' : '新建作品'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ featured: false }}
        >
          <Form.Item
            label="项目标题"
            name="title"
            rules={[{ required: true, message: '请输入项目标题' }]}
          >
            <Input
              placeholder="请输入项目标题"
              prefix={<ProjectOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="项目描述"
            name="description"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述你的项目内容、功能和特点"
            />
          </Form.Item>

          <Form.Item
            label="封面图片URL"
            name="imageUrl"
          >
            <Input placeholder="请输入封面图片URL（可选）" />
          </Form.Item>

          <Form.Item
            label="项目链接"
            name="projectUrl"
            rules={[{ type: 'url', message: '请输入有效的URL' }]}
          >
            <Input
              placeholder="https://example.com"
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="GitHub链接"
            name="githubUrl"
            rules={[{ type: 'url', message: '请输入有效的GitHub URL' }]}
          >
            <Input
              placeholder="https://github.com/username/repo"
              prefix={<GithubOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="技术栈"
            name="techStack"
          >
            <Input placeholder="例如：React, Node.js, MongoDB" />
          </Form.Item>

          <Form.Item
            label="特色项目"
            name="featured"
            valuePropName="checked"
            tooltip="特色项目会在首页或作品页面优先展示"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingProject(null);
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
                {editingProject ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;