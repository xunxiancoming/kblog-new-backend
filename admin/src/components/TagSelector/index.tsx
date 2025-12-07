import React, { useState } from "react";
import { Select, Tag as AntTag, Input, Button, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { apiService } from "../../services/api";
import { Tag as TagType } from "../../types";

const { Option } = Select;

interface TagSelectorProps {
  value?: number[];
  onChange?: (tagIds: number[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  value = [],
  onChange,
  placeholder = "请选择或创建标签",
  maxTags = 10,
  disabled = false,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>(value);
  const queryClient = useQueryClient();

  // 获取标签列表
  const { data: tagsData, isLoading } = useQuery<TagType[]>(
    "tags",
    () => apiService.getTags(),
    {
      select: (response: any) => response || [],
    }
  );

  // 创建标签
  const createTagMutation = useMutation(
    (data: { name: string; color?: string }) => apiService.createTag(data),
    {
      onSuccess: (newTag: TagType) => {
        message.success("标签创建成功");
        setNewTagName("");
        setShowCreateTag(false);
        queryClient.invalidateQueries("tags");

        // 自动选择新创建的标签
        const newSelectedTags = [...selectedTags, newTag.id];
        setSelectedTags(newSelectedTags);
        onChange?.(newSelectedTags);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || "创建标签失败");
      },
    }
  );

  // 处理标签选择变化
  const handleTagChange = (tagIds: number[]) => {
    if (tagIds.length > maxTags) {
      message.warning(`最多只能选择${maxTags}个标签`);
      return;
    }

    setSelectedTags(tagIds);
    onChange?.(tagIds);
  };

  // 处理创建新标签
  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      message.warning("请输入标签名称");
      return;
    }

    // 检查是否已存在同名标签
    const existsTag = tagsData?.some(
      (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (existsTag) {
      message.warning("标签已存在");
      return;
    }

    createTagMutation.mutate({
      name: newTagName.trim(),
      color: getRandomColor(),
    });
  };

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#faad14",
      "#f5222d",
      "#722ed1",
      "#13c2c2",
      "#eb2f96",
      "#fa541c",
      "#a0d911",
      "#2f54eb",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 获取未选中的标签
  const getAvailableTags = () => {
    if (!tagsData) return [];
    return tagsData.filter((tag) => !selectedTags.includes(tag.id));
  };

  // 获取已选中的标签信息
  const getSelectedTagsInfo = () => {
    if (!tagsData) return [];
    return tagsData.filter((tag) => selectedTags.includes(tag.id));
  };

  // 取消选择标签
  const handleRemoveTag = (tagId: number) => {
    const newSelectedTags = selectedTags.filter((id) => id !== tagId);
    setSelectedTags(newSelectedTags);
    onChange?.(newSelectedTags);
  };

  // 过滤选项（排除已选中的）
  const filterOption = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <div className="tag-selector">
      <Select
        mode="multiple"
        value={selectedTags}
        onChange={handleTagChange}
        placeholder={placeholder}
        loading={isLoading}
        disabled={disabled}
        showSearch
        filterOption={filterOption}
        style={{ width: "100%" }}
        maxTagCount={maxTags}
        dropdownRender={(menu) => (
          <>
            {menu}
            <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0" }}>
              {!showCreateTag ? (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setShowCreateTag(true)}
                  style={{ width: "100%" }}
                  disabled={disabled}
                >
                  创建新标签
                </Button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Input
                    placeholder="输入标签名称"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onPressEnter={handleCreateTag}
                    style={{ flex: 1 }}
                    size="small"
                  />
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleCreateTag}
                    loading={createTagMutation.isLoading}
                  >
                    确定
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setShowCreateTag(false);
                      setNewTagName("");
                    }}
                  >
                    取消
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      >
        {getAvailableTags().map((tag) => (
          <Option key={tag.id} value={tag.id}>
            <Space>
              <AntTag color={tag.color} style={{ marginRight: 4 }}>
                {tag.name}
              </AntTag>
              <span style={{ color: "#999", fontSize: "12px" }}>
                ({tag._count?.articles || 0})
              </span>
            </Space>
          </Option>
        ))}
      </Select>

      {/* 显示已选标签详情 */}
      {selectedTags.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
            已选择的标签 ({selectedTags.length}/{maxTags})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {getSelectedTagsInfo().map((tag) => (
              <AntTag
                key={tag.id}
                color={tag.color}
                closable={!disabled}
                onClose={() => handleRemoveTag(tag.id)}
                style={{ marginBottom: "4px" }}
              >
                {tag.name}
              </AntTag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
