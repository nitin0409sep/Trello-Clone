import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditItemDialog } from "./EditItemDialog";

export const SortableItem: React.FC<{
  item: string;
  index: number;
  card: { id: number; name: string; items: string[] };
  cardId: number;
  itemId: number;
  handleItemEdit: (id: number, idx: number, itemValue: string) => void;
  handleDeleteCardItem: (idx: number, id: number) => void;
  setEditCardItem: (value: boolean) => void;
  setItemId: (id: number) => void;
  setCardId: (id: number) => void;
}> = ({
  item,
  index,
  card,
  cardId,
  itemId,
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

  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);

  const handleClose = () => {
    setOpenEditItemDialog(false);
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
        <span>{item}</span>
      </div>

      <div className="flex gap-2 pl-1">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          onClick={(event) => {
            event.stopPropagation();
            setEditCardItem(true);
            setItemId(index);
            setCardId(card.id);
            setOpenEditItemDialog(true);
          }}
        >
          <i className="ri-edit-line"></i>
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

        <EditItemDialog
          {...{
            open: openEditItemDialog,
            setOpen: setOpenEditItemDialog,
            handleClose,
            isEditItem: true,
            handleItemEdit,
            cardId,
            itemId,
            item
          }}
        />
      </div>
    </div>
  );
};
