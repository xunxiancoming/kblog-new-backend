import React, { useState } from 'react';
import { Button, Card, Typography, Space, Spin, Alert } from 'antd';
import { apiService } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const DebugApi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testGetArticles = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing getArticles...');
      const response = await apiService.getArticles();
      console.log('Response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testGetArticle = async (id: number = 1) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log(`Testing getArticle(${id})...`);
      const response = await apiService.getArticle(id);
      console.log('Response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testGetTags = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing getTags...');
      const response = await apiService.getTags();
      console.log('Response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    console.log('Current token:', token);
    setResult({ token: token || 'No token found' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>API Debug</Title>

      <Card title="API Tests" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button onClick={testGetArticles} loading={loading}>
            获取文章列表
          </Button>
          <Button onClick={() => testGetArticle(1)} loading={loading}>
            获取文章详情 (ID: 1)
          </Button>
          <Button onClick={testGetTags} loading={loading}>
            获取标签列表
          </Button>
          <Button onClick={checkToken}>
            检查Token
          </Button>
        </Space>
      </Card>

      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>正在请求...</div>
          </div>
        </Card>
      )}

      {error && (
        <Alert
          message="API Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {result && (
        <Card title="API Response">
          <Paragraph>
            <Text strong>Response:</Text>
          </Paragraph>
          <pre
            style={{
              background: '#f6f8fa',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '14px'
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default DebugApi;