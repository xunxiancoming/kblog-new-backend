# 文章系统功能增强

本文档描述了为文章管理系统新增的功能组件和特性。

## 新增功能

### 1. 富文本编辑器 (RichTextEditor)

**位置**: `src/components/RichTextEditor/index.tsx`

**功能特性**:
- 支持 Markdown 编辑和实时预览
- 提供 Markdown 工具栏（粗体、斜体、标题、列表、链接、代码等）
- 三种编辑模式：可视化编辑、预览模式、Markdown 源码
- 语法高亮支持
- 响应式设计

**使用方法**:
```tsx
import RichTextEditor from '../components/RichTextEditor';

<RichTextEditor
  value={content}
  onChange={(value) => setContent(value)}
  placeholder="请输入内容"
  height={400}
/>
```

### 2. 标签选择器 (TagSelector)

**位置**: `src/components/TagSelector/index.tsx`

**功能特性**:
- 支持多选标签
- 可创建新标签
- 显示每个标签的文章数量
- 可设置最大标签数量限制
- 搜索和过滤功能

**使用方法**:
```tsx
import TagSelector from '../components/TagSelector';

<TagSelector
  value={selectedTagIds}
  onChange={(tagIds) => setSelectedTagIds(tagIds)}
  placeholder="请选择或创建标签"
  maxTags={8}
/>
```

### 3. 文章详情弹窗 (ArticleDetailModal)

**位置**: `src/components/ArticleDetailModal/index.tsx`

**功能特性**:
- 显示文章完整信息
- 三种查看模式：详情信息、内容预览、Markdown 源码
- 统计数据展示（浏览量、评论数、标签数等）
- 支持编辑、删除、分享操作
- Markdown 内容渲染

**使用方法**:
```tsx
import ArticleDetailModal from '../components/ArticleDetailModal';

<ArticleDetailModal
  visible={detailModalVisible}
  onCancel={handleCancel}
  articleId={selectedArticleId}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## 依赖包

新增的依赖包：

```json
{
  "@uiw/react-md-editor": "^3.23.5",
  "react-markdown": "^8.0.7",
  "rehype-highlight": "^6.0.0",
  "remark-gfm": "^3.0.1"
}
```

## 主要改进

### 文章页面 (Articles.tsx)

1. **编辑模式切换**: 支持 Markdown 和富文本编辑模式切换
2. **标签关联**: 集成标签选择器，支持多选和创建新标签
3. **详情查看**: 新增文章详情查看功能，支持多种查看模式
4. **用户体验**: 改进表单布局和交互体验

### 数据交互优化

- 支持异步加载标签列表
- 优化文章更新和删除的刷新逻辑
- 增加错误处理和用户反馈

## 样式和主题

所有组件都使用了 Ant Design 的设计语言，保持了界面的一致性：
- 支持主题色切换
- 响应式布局
- 优雅的过渡动画

## 使用指南

1. **创建文章**:
   - 点击"新建文章"按钮
   - 填写标题、摘要、封面图片
   - 选择或创建标签
   - 使用富文本编辑器编写内容
   - 选择发布状态并保存

2. **编辑文章**:
   - 在文章列表中点击编辑按钮
   - 修改相关信息
   - 切换编辑模式（Markdown/富文本）
   - 保存更改

3. **查看文章详情**:
   - 点击文章列表中的查看按钮
   - 在弹窗中查看完整信息
   - 可以切换不同查看模式
   - 支持编辑、删除、分享等操作

## 注意事项

1. 确保 API 服务端支持标签关联功能
2. Markdown 内容在前端渲染，后端需要存储原始 Markdown 文本
3. 图片上传功能需要后端配合实现文件上传接口
4. 代码高亮需要引入相应的 CSS 文件

## 扩展建议

1. **图片上传**: 集成图片上传组件，支持拖拽上传
2. **草稿自动保存**: 实现编辑时自动保存草稿功能
3. **文章模板**: 预设文章模板，提高写作效率
4. **协作编辑**: 支持多人协作编辑功能
5. **版本控制**: 实现文章版本历史和回滚功能