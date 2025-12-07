import React from 'react';
import { Card, Row, Col, Statistic, Table, List, Tag, Typography } from 'antd';
import {
  FileTextOutlined,
  MessageOutlined,
  TagsOutlined,
  ProjectOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery('stats-overview', apiService.getStatsOverview);

  const {
    data: monthlyStats,
    isLoading: monthlyLoading,
  } = useQuery('monthly-stats', () => apiService.getMonthlyStats());

  const {
    data: recentActivity,
    isLoading: activityLoading,
  } = useQuery('recent-activity', apiService.getRecentActivity);

  const {
    data: topArticles,
    isLoading: articlesLoading,
  } = useQuery('article-stats', apiService.getArticleStats);

  const formatMonthlyData = (data: any[]) => {
    return data?.map(item => ({
      month: dayjs().month(item.month - 1).format('MMM'),
      文章: item.articles,
      评论: item.comments,
      阅读: item.views,
    })) || [];
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'article':
        return '文章';
      case 'comment':
        return '评论';
      case 'project':
        return '项目';
      default:
        return type;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'blue';
      case 'comment':
        return 'green';
      case 'project':
        return 'purple';
      default:
        return 'default';
    }
  };

  const activityColumns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getActivityTypeColor(type)}>
          {getActivityTypeText(type)}
        </Tag>
      ),
      width: 80,
    },
    {
      title: '内容',
      key: 'content',
      render: (record: any) => {
        if (record.type === 'comment') {
          return `${record.author}: ${record.content.substring(0, 50)}...`;
        }
        return record.title;
      },
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        仪表盘
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="文章总数"
              value={stats?.articles || 0}
              prefix={<FileTextOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="评论总数"
              value={stats?.comments || 0}
              prefix={<MessageOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="标签总数"
              value={stats?.tags || 0}
              prefix={<TagsOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={stats?.projects || 0}
              prefix={<ProjectOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总阅读量"
              value={stats?.totalViews || 0}
              prefix={<EyeOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待审核评论"
              value={stats?.pendingComments || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: stats?.pendingComments ? '#cf1322' : '#3f8600' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 月度统计图表 */}
        <Col xs={24} lg={12}>
          <Card title="月度统计" loading={monthlyLoading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatMonthlyData(monthlyStats?.data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="文章" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="评论" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card title="最近活动" loading={activityLoading}>
            <Table
              dataSource={recentActivity}
              columns={activityColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* 热门文章 */}
      {topArticles?.topViewed && topArticles.topViewed.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="热门文章" loading={articlesLoading}>
              <List
                dataSource={topArticles.topViewed}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <a href={`/articles/${item.id}`} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      }
                      description={`${item.viewCount} 次阅读 • ${item._count.comments} 条评论`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;