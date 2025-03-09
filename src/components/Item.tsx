import { } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { ItemProps } from "../interface/Card.interface";

const Item: React.FC<ItemProps> = ({
  setCardId,
  setEditCardName,
  setEditCardItem,
  setItemId,
  card,
  editCardName,
  cardId,
  itemId,
  handleCardNameEdit,
  handleItemEdit,
  handleDeleteCardItem,
  cardNameRef,
}) => {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-4 gap-2">
        {editCardName && cardId === card.id ? (
          <input
            ref={cardNameRef}
            placeholder="Edit Card Name"
            className="pl-2 p-1 outline-0 border-2 border-gray-400 rounded-xl"
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">
            {card.name}
          </h3>
        )}
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            onClick={
              editCardName && card.id === cardId
                ? () => {
                    handleCardNameEdit(card.id);
                    setEditCardName(false);
                  }
                : () => {
                    setEditCardName(true);
                    setCardId(card.id);
                  }
            }
          >
            {editCardName && card.id === cardId ? (
              <i className="ri-checkbox-circle-line"></i>
            ) : (
              <i className="ri-edit-line"></i>
            )}
          </button>

          <button
            className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <i className="ri-delete-bin-6-line"></i>
          </button>
        </div>
      </div>

      <div className="space-y-3 overflow-auto flex-grow max-h-60">
        <SortableContext
          key={card.id}
          items={card.items}
          strategy={verticalListSortingStrategy}
        >
          {!card.items.length && (
            <>
              <div className="flex items-center justify-center h-5/6">
                No Item Found
              </div>
            </>
          )}

          {card.items &&
            card.items.map((item) => (
              <SortableItem
                key={item.id}
                index={item.id}
                item={item}
                card={card}
                cardId={cardId}
                itemId={itemId}
                handleItemEdit={handleItemEdit}
                handleDeleteCardItem={handleDeleteCardItem}
                setEditCardItem={setEditCardItem}
                setItemId={setItemId}
                setCardId={setCardId}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
};

export { Item };
