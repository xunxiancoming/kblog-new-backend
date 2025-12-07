import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile: React.FC = () => {
  return (
    <div>
      <Title level={2}>个人信息</Title>
      <p>个人信息管理功能正在开发中...</p>
    </div>
  );
};

export default Profile;