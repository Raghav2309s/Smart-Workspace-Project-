import { useState } from 'react';
import { useStore } from '../store';
import { BlockType, Block } from '../types';

interface EditorProps {
  block: Block;
  onBlockChange: (block: Block) => void;
}

const Editor = ({ block, onBlockChange }: EditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { addBlock, removeBlock } = useStore();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onBlockChange({ ...block, content: e.target.value });
  };

  const handleAddBlock = (type: BlockType) => {
    addBlock({
      id: Date.now().toString(),
      type,
      content: '',
      parentId: block.id,
    });
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="p-2 border rounded">
            {isEditing ? (
              <textarea
                value={block.content}
                onChange={handleContentChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {block.content}
              </div>
            )}
          </div>
        );
      case 'heading':
        return (
          <h2
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {block.content}
          </h2>
        );
      case 'code':
        return (
          <pre
            className="bg-gray-800 text-white p-4 rounded"
            onClick={() => setIsEditing(true)}
          >
            {block.content}
          </pre>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {renderBlock()}
      <div className="flex gap-2">
        <button
          onClick={() => handleAddBlock('text')}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Add Text
        </button>
        <button
          onClick={() => handleAddBlock('heading')}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Add Heading
        </button>
        <button
          onClick={() => handleAddBlock('code')}
          className="px-2 py-1 bg-purple-500 text-white rounded"
        >
          Add Code
        </button>
      </div>
    </div>
  );
};

export default Editor;
