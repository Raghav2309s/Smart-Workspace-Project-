import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import Editor from './components/Editor';
import AIFeatures from './components/AIFeatures';
import PageManagement from './components/PageManagement';
import { Block, Page } from './types';

function App() {
  const { blocks, addBlock } = useStore();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    // Fetch pages from backend
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/pages');
        const data = await response.json();
        setPages(data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages();
  }, []);

  // Add initial blocks if none exist
  if (blocks.length === 0) {
    addBlock({
      id: Date.now().toString(),
      type: 'text',
      content: 'Welcome to Smart Workspace! Start typing to begin...',
    });
  }

  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Smart Workspace</h1>
          </header>
          
          <main className="bg-white rounded-lg shadow p-6">
            <SignedIn>
              <div className="space-y-6">
                <PageManagement pages={pages} />
                
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div key={block.id} className="space-y-2">
                      <Editor
                        block={block}
                        onBlockChange={(updatedBlock: Block) => {
                          useStore.getState().updateBlock(updatedBlock);
                        }}
                      />
                      <AIFeatures block={block} />
                    </div>
                  ))}
                </div>
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignIn />
            </SignedOut>
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default App;
