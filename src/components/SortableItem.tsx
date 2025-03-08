import React, { Ref } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem: React.FC<{
  item: string;
  index: number;
  card: { id: number; name: string; items: string[] };
  editCardItem: boolean;
  cardId: number;
  itemId: number;
  itemNameRef: Ref<HTMLInputElement> | undefined;
  handleItemEdit: (id: number, idx: number) => void;
  handleDeleteCardItem: (idx: number, id: number) => void;
  setEditCardItem: (value: boolean) => void;
  setItemId: (id: number) => void;
  setCardId: (id: number) => void;
}> = ({
  item,
  index,
  card,
  editCardItem,
  cardId,
  itemId,
  itemNameRef,
  handleItemEdit,
  handleDeleteCardItem,
  setEditCardItem,
  setItemId,
  setCardId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-lg w-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex justify-between items-center bg-gray-200 p-2 rounded-lg flex-1"
      >
        {editCardItem && card.id === cardId && index === itemId ? (
          <input
            type="text"
            ref={itemNameRef}
            className="w-full outline-0 border-2 border-gray-400 rounded-md pl-2 pr-1"
          />
        ) : (
          <span>{item}</span>
        )}
      </div>

      <div className="flex gap-2 pl-1">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          onClick={
            editCardItem && card.id === cardId && index === itemId
              ? (event) => {
                  event.stopPropagation();
                  handleItemEdit(card.id, index);
                  setEditCardItem(false);
                }
              : (event) => {
                  event.stopPropagation();
                  setEditCardItem(true);
                  setItemId(index);
                  setCardId(card.id);
                }
          }
        >
          {editCardItem && card.id === cardId && index === itemId ? (
            <i className="ri-checkbox-circle-line"></i>
          ) : (
            <i className="ri-edit-line"></i>
          )}
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteCardItem(index, card.id);
          }}
        >
          <i className="ri-delete-bin-6-line"></i>
        </button>
      </div>
    </div>
  );
};
