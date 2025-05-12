import { useState } from 'react';
import { useStore } from '../store';
import { Block } from '../types';

interface AIFeaturesProps {
  block: Block;
}

const AIFeatures = ({ block }: AIFeaturesProps) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateBlock } = useStore();

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: block.content }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTag = async () => {
    try {
      const response = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: block.content }),
      });
      const data = await response.json();
      updateBlock({
        ...block,
        tags: data.tags,
      });
    } catch (error) {
      console.error('Error generating tags:', error);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        <button
          onClick={handleAutoTag}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Auto Tag
        </button>
      </div>
      {summary && (
        <div className="mt-2 p-3 bg-gray-100 rounded">
          <h3 className="text-sm font-semibold mb-2">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AIFeatures;
