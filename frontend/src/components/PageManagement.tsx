import { useState } from 'react';
import { useStore } from '../store';
import { Page } from '../types';

interface PageManagementProps {
  pages: Page[];
}

const PageManagement = ({ pages }: PageManagementProps) => {
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showGenerateNote, setShowGenerateNote] = useState(false);
  const [noteTopic, setNoteTopic] = useState('');
  const { addBlock } = useStore();

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPageTitle,
          content: '',
          tags: [],
        }),
      });
      const page = await response.json();
      addBlock({
        id: page.id,
        type: 'text',
        content: page.content,
      });
      setNewPageTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleGenerateNote = async () => {
    if (!noteTopic.trim()) return;

    try {
      const response = await fetch('/api/generate-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: noteTopic }),
      });
      const { note } = await response.json();
      
      // Create new page with generated note
      const pageResponse = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteTopic,
          content: note,
          tags: ['generated'],
        }),
      });
      const page = await pageResponse.json();
      
      addBlock({
        id: page.id,
        type: 'text',
        content: note,
      });
      setShowGenerateNote(false);
      setNoteTopic('');
    } catch (error) {
      console.error('Error generating note:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="New page title..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleCreatePage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Page
        </button>
      </div>

      <button
        onClick={() => setShowGenerateNote(true)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate Note
      </button>

      {showGenerateNote && (
        <div className="p-4 bg-white rounded shadow">
          <input
            type="text"
            value={noteTopic}
            onChange={(e) => setNoteTopic(e.target.value)}
            placeholder="Enter topic for note generation..."
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleGenerateNote}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Generate
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Pages</h3>
        {pages.map((page) => (
          <div
            key={page.id}
            className="p-3 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <h4 className="font-medium">{page.title}</h4>
              <div className="flex gap-2">
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManagement;
