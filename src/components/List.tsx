import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ListItem {
  id: number;
  list_name: string;
}
interface CardItem {
  id: number;
  card_name: string;
  listId: number;
}

const List = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState<ListItem[]>([]);
  const [cards, setCards] = useState<{ [key: number]: CardItem[] }>({});
  const [listIsOpen, listSetIsOpen] = useState(false);
  const [openCardListId, setOpenCardListId] = useState<number | null>(null);
  const [listName, setListName] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  const fetchLists = async () => {
    try {
      const response = await axios.get<ListItem[]>(
        `http://localhost:3000/list/find_list_against_boardId/${boardId}`
      );
      setLists(response.data);
      // 🪄 Fetch cards for each list right after fetching lists
      response.data.forEach((list) => {
        fetchCards(list.id);
      });
    } catch (error) {
      console.error("❌ Error fetching lists:", error);
    }
  };

  const fetchCards = async (listId: number) => {
    try {
      const response = await axios.get<CardItem[]>(
        `http://localhost:3000/card/find_list_against_listId/${listId}`
      );
      setCards((prev) => ({
        ...prev,
        [listId]: response.data,
      }));
    } catch (error) {
      console.error("❌ Error fetching cards:", error);
    }
  };

  const handleSaveCard = async (listId: number) => {
    if (!cardName.trim()) {
      alert("⚠️ Card name is required!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/card/${listId}`,
        {
          card_name: cardName,
        }
      );
      console.log("✅ Card Saved:", response.data);
      setCardName("");
      fetchCards(listId);
      setOpenCardListId(null);
    } catch (error) {
      console.error("❌ Error saving card:", error);
    }
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      alert("⚠️ List name is required!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/list/${boardId}`,
        {
          list_name: listName,
        }
      );
      console.log("✅ List Saved:", response.data);
      listSetIsOpen(false);
      setListName("");
      fetchLists();
    } catch (error) {
      console.error("❌ Error saving list:", error);
    }
  };

  return (
    <div className="relative h-screen bg-gray-100 p-8">
      <button
        onClick={() => listSetIsOpen(!listIsOpen)}
        className="absolute top-4 left-4 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-700"
      >
        Add List
      </button>

      {/* Mini Modal */}
      {listIsOpen && (
        <div className="absolute top-16 left-4 bg-white p-4 rounded-lg shadow-lg w-64">
          <input
            type="text"
            placeholder="List Name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSaveList}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-4">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {list.list_name}
                </h2>
                <button
                  onClick={() => {
                    const shouldOpen = openCardListId !== list.id;
                    setOpenCardListId(shouldOpen ? list.id : null);
                    if (shouldOpen) fetchCards(list.id);
                  }}
                  className="bg-blue-400 px-2 py-2 rounded-2xl hover:bg-amber-200"
                >
                  Add Card
                </button>
              </div>

              {/* Show cards */}
              {cards[list.id]?.map((card) => (
                <div
                  key={card.id}
                  className="mt-2 p-2 bg-gray-100 rounded shadow-sm text-gray-800"
                >
                  {card.card_name}
                </div>
              ))}

              {/* Show input only when this list is open */}
              {openCardListId === list.id && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Card Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveCard(list.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No lists found for this board.</p>
        )}
      </div>
    </div>
  );
};

export default List;
