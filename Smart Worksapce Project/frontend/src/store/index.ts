import create from 'zustand';

interface Block {
  id: string;
  type: 'text' | 'heading' | 'code';
  content: string;
  parentId?: string;
}

interface Store {
  blocks: Block[];
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (block: Block) => void;
}

export const useStore = create<Store>((set) => ({
  blocks: [],
  addBlock: (block) =>
    set((state) => ({ blocks: [...state.blocks, block] })),
  removeBlock: (id) =>
    set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),
  updateBlock: (block) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === block.id ? block : b)),
    })),
}));
