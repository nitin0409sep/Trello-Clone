import { Ref } from "react";

export interface Card {
  id: number;
  name: string;
  items: { id: string; item: string }[];
}

export interface ItemProps {
  setCardId: (id: number) => void;
  setEditCardName: (value: boolean) => void;
  setEditCardItem: (value: boolean) => void;
  setItemId: (id: string) => void;
  card: Card;
  editCardName: boolean;
  cardId: number;
  itemId: string;
  handleCardNameEdit: (id: number) => void;
  handleItemEdit: (id: number, idx: string, itemValue: string) => void;
  handleDeleteCardItem: (idx: string, id: number) => void;
  cardNameRef: Ref<HTMLInputElement | null>;
}
