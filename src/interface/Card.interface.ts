export interface Card {
  id: number;
  name: string;
  items: string[];
}

export interface ItemProps {
  setCardId: (id: number) => void;
  setEditCardName: (value: boolean) => void;
  setEditCardItem: (value: boolean) => void;
  setItemId: (id: number) => void;
  card: { id: number; name: string; items: string[] };
  editCardName: boolean;
  editCardItem: boolean;
  cardId: number;
  itemId: number;
  handleCardNameEdit: (id: number) => void;
  handleItemEdit: (id: number, idx: number) => void;
  handleDeleteCardItem: (idx: number, id: number) => void;
  cardNameRef: any;
  itemNameRef: any;
  updateItemsPosition: (id: number, newItems: string[]) => void;
}
