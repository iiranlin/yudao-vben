/**
 * React 组件中使用权限判断示例
 */

import React from 'react';
import { Button, Table, Space } from 'antd';
import { hasPermission, usePermission } from '@/utils/permission';

/**
 * 示例 1: 使用函数式判断
 */
export const UserListExample1: React.FC = () => {
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {/* 只有 react:user:create 权限才显示新建按钮 */}
        {hasPermission('react:user:create') && (
          <Button type="primary">新建用户</Button>
        )}

        {/* 有 react:user:import 或 react:user:export 任意权限就显示 */}
        {hasPermission(['react:user:import', 'react:user:export']) && (
          <>
            <Button>导入</Button>
            <Button>导出</Button>
          </>
        )}
      </Space>

      <Table
        dataSource={[]}
        columns={[
          {
            title: '用户名',
            dataIndex: 'username',
          },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                {/* 编辑权限 */}
                {hasPermission('react:user:edit') && (
                  <Button type="link">编辑</Button>
                )}

                {/* 删除权限 */}
                {hasPermission('react:user:delete') && (
                  <Button type="link" danger>
                    删除
                  </Button>
                )}

                {/* 重置密码权限 */}
                {hasPermission('react:user:resetPassword') && (
                  <Button type="link">重置密码</Button>
                )}
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

/**
 * 示例 2: 使用 Hook
 */
export const UserListExample2: React.FC = () => {
  const { hasPermission, hasAnyPermission } = usePermission();

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {hasPermission('react:user:create') && (
          <Button type="primary">新建用户</Button>
        )}

        {hasAnyPermission(['react:user:import', 'react:user:export']) && (
          <>
            <Button>批量操作</Button>
          </>
        )}
      </Space>
    </div>
  );
};

/**
 * 示例 3: 权限组件封装
 */
interface PermissionProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Permission: React.FC<PermissionProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const visible = hasPermission(permission);
  return <>{visible ? children : fallback}</>;
};

// 使用权限组件
export const UserListExample3: React.FC = () => {
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Permission permission="react:user:create">
          <Button type="primary">新建用户</Button>
        </Permission>

        <Permission
          permission={['react:user:import', 'react:user:export']}
          fallback={<span style={{ color: '#999' }}>无导入导出权限</span>}
        >
          <Button>批量操作</Button>
        </Permission>
      </Space>
    </div>
  );
};

/**
 * 示例 4: 在业务逻辑中使用权限判断
 */
export const UserListExample4: React.FC = () => {
  const handleDelete = (userId: string) => {
    // 在业务逻辑中判断权限
    if (!hasPermission('react:user:delete')) {
      console.error('无删除权限');
      return;
    }

    // 执行删除操作
    console.log('删除用户:', userId);
  };

  const handleBatchOperation = () => {
    // 判断是否有任意一个批量操作权限
    if (
      !hasPermission([
        'react:user:import',
        'react:user:export',
        'react:user:batchDelete',
      ])
    ) {
      console.error('无批量操作权限');
      return;
    }

    // 执行批量操作
    console.log('批量操作');
  };

  return (
    <div>
      <Space>
        <Button onClick={handleBatchOperation}>批量操作</Button>
        <Button onClick={() => handleDelete('123')}>删除</Button>
      </Space>
    </div>
  );
};

export default UserListExample1;
