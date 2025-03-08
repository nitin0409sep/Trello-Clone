import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
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
  editCardItem,
  cardId,
  itemId,
  handleCardNameEdit,
  handleItemEdit,
  handleDeleteCardItem,
  cardNameRef,
  itemNameRef,
  updateItemsPosition,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = card.items.indexOf(active.id);
    const newIndex = card.items.indexOf(over.id);
    const newItems = arrayMove(card.items, oldIndex, newIndex);

    updateItemsPosition(card.id, newItems);
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
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
              card.items.map((item, index) => (
                <SortableItem
                  key={item}
                  item={item}
                  index={index}
                  card={card}
                  editCardItem={editCardItem}
                  cardId={cardId}
                  itemId={itemId}
                  itemNameRef={itemNameRef}
                  handleItemEdit={handleItemEdit}
                  handleDeleteCardItem={handleDeleteCardItem}
                  setEditCardItem={setEditCardItem}
                  setItemId={setItemId}
                  setCardId={setCardId}
                />
              ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export { Item };
