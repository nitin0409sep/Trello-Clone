import { useEffect, useRef, useState } from "react";
import { Item } from "./Item";
import { AddItemDialog } from "./AddItemDialog";
import { Card } from "../interface/Card.interface";
import { showToast } from "../utility/toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth.context";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

const Cards = () => {
  const [cards, setCards] = useState<Card[] | []>([]);

  const [cardId, setCardId] = useState(-1);
  const [editCardName, setEditCardName] = useState(false);
  const cardNameRef = useRef<HTMLInputElement | null>(null);

  const [editCardItem, setEditCardItem] = useState(false);
  const [itemId, setItemId] = useState<string>("");

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

  function handleItemEdit(id: number, itemIdx: string, itemValue: string) {
    if (!id || itemIdx === undefined) {
      showToast("error", "Card Id and Item Idx are required");
      return;
    }

    if (!itemValue) {
      showToast("error", "Item Name can't be empty");
      return;
    }

    setCards((prevCards) => {
      const updatedCards = prevCards.map((card: Card) => ({
        ...card,
        items: card.items.map((item) =>
          item.id === itemIdx ? { ...item, item: itemValue } : item
        ),
      }));

      setCardsInLocalStorage(updatedCards);
      return updatedCards;
    });

    showToast("success", "Item updated successfully");
    setCardId(-1);
  }

  function handleDeleteCardItem(itemId: string, cardId: number) {
    if (itemId === undefined || cardId === undefined) {
      showToast("error", "Card Id and Item Idx are required");
      return;
    }

    setCards((prevCards) => {
      const cards = prevCards.map((card) =>
        card.id === cardId
          ? {
            ...card,
            items: card.items.filter((item) => item.id !== itemId),
          }
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
      const newItem = {
        id: uuidv4(),
        item: itemValue,
      };

      const cards = prevCards.map((card) => {
        return card.id === cardId
          ? {
            ...card,
            items: [...card.items, newItem],
          }
          : card;
      });

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

    const activeCardId = cards.find((card) => {
      return card.items.some((item) => item.id === active.id);
    })?.id;

    const overCardId = cards.find((card) => {
      return card.items.some((item) => item.id === over.id);
    })?.id;

    if (!activeCardId || !overCardId) return;

    setCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.id === activeCardId && activeCardId === overCardId) {
          // Same Card
          if (card.items.some((item) => item.id === active.id)) {
            const fromIndex = card.items.findIndex(
              (item) => item.id === active.id
            );
            const toIndex = card.items.findIndex((item) => item.id === over.id);

            if (fromIndex !== -1 && toIndex !== -1) {
              const newItems = [...card.items];
              const [movedItem] = newItems.splice(fromIndex, 1);
              newItems.splice(toIndex, 0, movedItem);

              return { ...card, items: newItems };
            }
          }
        } else if (card.id === activeCardId) {
          return {
            ...card,
            items: card.items.filter((item) => item.id !== active.id),
          };
        } else if (card.id === overCardId) {
          const activeCard = prevCards.find((c) => c.id === activeCardId);
          const movedItem = activeCard?.items.find(
            (item) => item.id === active.id
          );

          if (!movedItem) return card; // Safety check to avoid errors

          const overIndex = card.items.findIndex((item) => item.id === over.id);
          const newItems = [...card.items];

          if (overIndex !== -1) {
            newItems.splice(overIndex, 0, movedItem);
          } else {
            newItems.push(movedItem); // If `over.id` is not found, append to the end
          }

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
