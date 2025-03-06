interface ItemProps {
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
}

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
          {editCardName && card.id === cardId ? "Save" : "Edit"}
        </button>
      </div>

      <div className="space-y-3 overflow-auto flex-grow max-h-60">
        {card.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-200 p-2 rounded-lg"
          >
            {editCardItem && card.id === cardId && index === itemId ? (
              <input
                type="text"
                ref={itemNameRef}
                className="w-26 outline-0 border-2 border-gray-400  rounded-md pl-2 pr-1"
              />
            ) : (
              <span>{item}</span>
            )}

            <div className="flex gap-2 pl-1">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                onClick={
                  editCardItem && card.id === cardId && index === itemId
                    ? () => {
                        handleItemEdit(card.id, index);
                        setEditCardItem(false);
                      }
                    : () => {
                        setEditCardItem(true);
                        setItemId(index);
                        setCardId(card.id);
                      }
                }
              >
                {editCardItem && card.id === cardId && index === itemId
                  ? "Save"
                  : "Edit"}
              </button>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                onClick={() => handleDeleteCardItem(index, card.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Item;
