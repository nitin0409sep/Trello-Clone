import { useRef, useState } from "react";
import Item from "./Item";
import { AddItemDialog } from "./AddItemDialog";

const CardList = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Card 1", items: ["Item 1", "Item 2", "Item 3", "Item 4"] },
    { id: 2, name: "Card 2", items: ["Item A", "Item B"] },
    {
      id: 3,
      name: "Card 3",
      items: ["Item X", "Item Y", "Item Z"],
    },
    { id: 4, name: "Card 4", items: ["Item Alpha", "Item Beta"] },
  ]);

  const [cardId, setCardId] = useState(-1);
  const [editCardName, setEditCardName] = useState(false);
  const cardNameRef = useRef<HTMLInputElement | null>(null);

  const [editCardItem, setEditCardItem] = useState(false);
  const [itemId, setItemId] = useState(-1);
  const itemNameRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);

  const [isAddItem, setIsAddItem] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  function handleCardNameEdit(id: number) {
    if (!id || !cardNameRef.current?.value) {
      alert("Id and name of card are required.");
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? { ...card, name: cardNameRef.current?.value ?? card.name }
          : card
      )
    );
  }

  function handleItemEdit(id: number, itemIdx: number) {
    if (!id || itemIdx === undefined) {
      alert("Card Id and Item Idx are required");
      return;
    }

    if (!itemNameRef.current?.value) {
      alert("Item Name can't be empty");
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, items: [...card.items, itemNameRef.current!.value] }
          : card
      )
    );

    setCardId(-1);
  }

  function handleDeleteCardItem(itemId: number, cardId: number) {
    if (itemId === undefined || cardId === undefined) {
      alert("Card Id and Item Idx are required");
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, items: card.items.filter((_, idx) => idx !== itemId) }
          : card
      )
    );

    setCardId(-1);
  }

  function handleAddCardItem(itemValue: string) {
    if (cardId === undefined) {
      alert("Card Id is required");
      return;
    }

    if (!itemValue) {
      alert("Item Value can't be empty");
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, items: [...card.items, itemValue] }
          : card
      )
    );

    setCardId(-1);
  }

  function handleAddCard(cardValue: string) {
    const trimmedValue = cardValue.trim();

    if (!trimmedValue) {
      alert("Card Name can't be empty");
      return;
    }

    setCards((prevCards) => [
      ...prevCards,
      {
        id: cards.length + 1,
        name: trimmedValue,
        items: [],
      },
    ]);
  }

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-center p-3 text-2xl font-mono underline decoration-wavy underline-offset-4">To Do</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 overflow-auto flex-grow">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col h-96"
          >
            <Item
              {...{
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
              }}
            />

            <button
              className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
              onClick={() => {
                setOpen(true);
                setCardId(card.id);
                setIsAddItem(true);
              }}
            >
              Add Item
            </button>

            <AddItemDialog
              {...{
                open,
                setOpen,
                handleClose,
                handleAddCardItem,
                handleAddCard,
                isAddItem,
              }}
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-6 shadow-lg flex justify-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
          onClick={() => {
            setIsAddItem(false);
            setOpen(true);
          }}
        >
          Add Card
        </button>
      </div>
    </div>
  );
};

export default CardList;
