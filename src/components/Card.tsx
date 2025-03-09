import { useEffect, useRef, useState } from "react";
import { Item } from "./Item";
import { AddItemDialog } from "./AddItemDialog";
import { Card } from "../interface/Card.interface";
import { showToast } from "../utility/toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth.context";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const Cards = () => {
  const [cards, setCards] = useState<Card[] | []>([]);

  const [cardId, setCardId] = useState(-1);
  const [editCardName, setEditCardName] = useState(false);
  const cardNameRef = useRef<HTMLInputElement | null>(null);

  const [editCardItem, setEditCardItem] = useState(false);
  const [itemId, setItemId] = useState(-1);

  const [open, setOpen] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);

  const navigate = useNavigate();

  const { setIsLoggedIn } = useAuthContext();

  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("cards")!);

    if (cards && cards.length) setCards(cards);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const setCardsInLocalStorage = (cards: Card[]) => {
    localStorage.setItem("cards", JSON.stringify(cards));
  };

  function handleCardNameEdit(id: number) {
    if (!id || !cardNameRef.current?.value) {
      showToast("error", "Name of card are required.");
      return;
    }

    setCards((prevCards) => {
      const cards = prevCards.map((card) =>
        card.id === id
          ? { ...card, name: cardNameRef.current?.value ?? card.name }
          : card
      );

      setCardsInLocalStorage(cards);
      return cards;
    });

    showToast("success", "Card Name Updated Successfully");
  }

  function handleItemEdit(id: number, itemIdx: number, itemValue: string) {
    if (!id || itemIdx === undefined) {
      showToast("error", "Card Id and Item Idx are required");
      return;
    }

    if (!itemValue) {
      showToast("error", "Item Name can't be empty");
      return;
    }

    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[id - 1] = {
        ...updatedCards[id - 1],
        items: [...updatedCards[id - 1].items],
      };

      updatedCards[id - 1].items[itemIdx] = itemValue;

      setCardsInLocalStorage(updatedCards);

      return updatedCards;
    });

    showToast("success", "Item updated successfully");
    setCardId(-1); // Reset cardId if necessary
  }

  function handleDeleteCardItem(itemId: number, cardId: number) {
    if (itemId === undefined || cardId === undefined) {
      showToast("error", "Card Id and Item Idx are required");
      return;
    }

    setCards((prevCards) => {
      const cards = prevCards.map((card) =>
        card.id === cardId
          ? { ...card, items: card.items.filter((_, idx) => idx !== itemId) }
          : card
      );

      setCardsInLocalStorage(cards);
      return cards;
    });

    showToast("success", "Card Deleted Successfully");
    setCardId(-1);
  }

  function handleAddCardItem(itemValue: string) {
    if (cardId === undefined) {
      showToast("error", "Card Id is required");
      return;
    }

    if (!itemValue) {
      showToast("error", "Item Value can't be empty");
      return;
    }

    setCards((prevCards) => {
      const cards = prevCards.map((card) =>
        card.id === cardId
          ? { ...card, items: [...card.items, itemValue] }
          : card
      );

      setCardsInLocalStorage(cards);
      return cards;
    });

    showToast("success", "Item Added Successfully");

    setCardId(-1);
  }

  function handleAddCard(cardValue: string) {
    const trimmedValue = cardValue.trim();

    if (!trimmedValue) {
      showToast("error", "Card Name can't be empty");
      return;
    }

    setCards((prevCards) => {
      const cards = [
        ...prevCards,
        {
          id: prevCards.length + 1,
          name: trimmedValue,
          items: [],
        },
      ];

      setCardsInLocalStorage(cards);
      return cards;
    });

    showToast("success", "Card Added Successfully");
  }

  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    showToast("success", "You Logged Out Successfully");
    navigate("auth/login");
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeCardId = cards.find((card) =>
      card.items.includes(active.id)
    )?.id;
    const overCardId = cards.find((card) => card.items.includes(over.id))?.id;

    if (!activeCardId || !overCardId) return;

    setCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.id === activeCardId && activeCardId === overCardId) {
          // Reorder within the same card
          return {
            ...card,
            items: arrayMove(
              card.items,
              card.items.indexOf(active.id),
              card.items.indexOf(over.id)
            ),
          };
        } else if (card.id === activeCardId) {
          // Remove from the old card
          return {
            ...card,
            items: card.items.filter((item) => item !== active.id),
          };
        } else if (card.id === overCardId) {
          // Add to the new card
          const newItems = [...card.items];
          const overIndex = card.items.indexOf(over.id);
          newItems.splice(overIndex, 0, active.id);

          return { ...card, items: newItems };
        }
        return card;
      });
    });

    setCardsInLocalStorage(cards);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen">
        <h1 className="text-center p-3 text-2xl font-mono underline decoration-wavy underline-offset-4 text-gray-600">
          Trello
        </h1>
        <button
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full fixed right-8 cursor-pointer"
          onClick={() => logout()}
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>

        {!cards?.length && (
          <div className="text-center flex items-center justify-center h-full w-full text-4xl font-mono text-gray-600">
            No Cards Found
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 overflow-auto flex-grow">
          {cards &&
            cards.map((card) => (
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
    </DndContext>
  );
};

export default Cards;
