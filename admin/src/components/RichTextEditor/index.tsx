import React, { useState, useCallback } from 'react';
import { Tabs, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import './Editor.css';

const { TabPane } = Tabs;

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 400,
  disabled = false
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'markdown'>('edit');
  const [content, setContent] = useState(value);

  const handleContentChange = useCallback((newValue: string | undefined) => {
    const finalValue = newValue || '';
    setContent(finalValue);
    onChange?.(finalValue);
  }, [onChange]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'edit' | 'preview' | 'markdown');
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector('.w-md-editor-text-area') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);

      let newText = '';
      if (syntax.includes('**') || syntax.includes('*') || syntax.includes('~~')) {
        newText = text.substring(0, start) + syntax + selectedText + syntax + text.substring(end);
      } else if (syntax.startsWith('[')) {
        newText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
      } else if (syntax.startsWith('`')) {
        newText = text.substring(0, start) + `\`${selectedText}\`` + text.substring(end);
      } else if (syntax.startsWith('```')) {
        newText = text.substring(0, start) + '\n```\n' + selectedText + '\n```\n' + text.substring(end);
      } else {
        newText = text.substring(0, start) + syntax + selectedText + text.substring(end);
      }

      handleContentChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + syntax.length, start + syntax.length + selectedText.length);
      }, 0);
    }
  };

  const toolbarButtons = [
    { icon: 'B', title: '粗体', syntax: '**' },
    { icon: 'I', title: '斜体', syntax: '*' },
    { icon: 'S', title: '删除线', syntax: '~~' },
    { icon: 'H', title: '标题', syntax: '\n## ' },
    { icon: '"', title: '引用', syntax: '\n> ' },
    { icon: '•', title: '无序列表', syntax: '\n- ' },
    { icon: '1.', title: '有序列表', syntax: '\n1. ' },
    { icon: '[ ]', title: '链接', syntax: '[' },
    { icon: '</>', title: '代码', syntax: '`' },
    { icon: '{}', title: '代码块', syntax: '```' },
  ];

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <Space size="small">
          {toolbarButtons.map((btn, index) => (
            <Button
              key={index}
              size="small"
              type="text"
              title={btn.title}
              onClick={() => insertMarkdown(btn.syntax)}
              style={{
                fontFamily: btn.icon === 'B' || btn.icon === 'I' || btn.icon === 'S' ? 'bold' : 'inherit',
                fontWeight: btn.icon === 'B' ? 'bold' : btn.icon === 'I' ? 'normal' : 'inherit',
                fontStyle: btn.icon === 'I' ? 'italic' : 'inherit',
                textDecoration: btn.icon === 'S' ? 'line-through' : 'inherit'
              }}
            >
              {btn.icon}
            </Button>
          ))}
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
        <TabPane
          tab={
            <span>
              <EditOutlined />
              编辑
            </span>
          }
          key="edit"
        >
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height={height}
            preview="edit"
            hideToolbar={true}
            textareaProps={{
              placeholder,
              disabled
            }}
            visibleDragbar={false}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <EyeOutlined />
              预览
            </span>
          }
          key="preview"
        >
          <div
            className="markdown-preview"
            style={{
              height: height,
              overflow: 'auto',
              padding: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              backgroundColor: '#fff'
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({node, inline, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className={className}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content || '暂无内容'}
            </ReactMarkdown>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Markdown
            </span>
          }
          key="markdown"
        >
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              height: height,
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              resize: 'vertical'
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;