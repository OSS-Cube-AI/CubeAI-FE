export type BlockItem = {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
  color?: string;
  isToggle?: boolean;
  toggleOn?: boolean;
  parameters: number[];
  deletable?: boolean;
};

type Listener = (blocks: BlockItem[]) => void;

const blocks: BlockItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  const snapshot = [...blocks];
  listeners.forEach((fn) => fn(snapshot));
}

export function getBlocks(): BlockItem[] {
  return [...blocks];
}

export function addBlock(block: BlockItem) {
  blocks.push(block);
  notify();
}

export function removeBlock(id: string) {
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx !== -1) {
    blocks.splice(idx, 1);
    notify();
  }
}

export function clearBlocks() {
  if (blocks.length) {
    blocks.splice(0, blocks.length);
    notify();
  }
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
} 