export type BlockType = 'text' | 'heading' | 'code';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  parentId?: string;
}

export interface Page {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
