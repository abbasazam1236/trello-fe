import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// ✅ Define the type for a List
interface ListItem {
  id: number;
  list_name: string;
}

const List = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState<ListItem[]>([]); // ✅ Use ListItem type
  const [listIsOpen, listSetIsOpen] = useState(false);
  const [openCardListId, setOpenCardListId] = useState<number | null>(null);
  const [listName, setListName] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    console.log("board_Id useefefct", boardId);
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  const fetchLists = async () => {
    try {
      const response = await axios.get<ListItem[]>(
        `http://localhost:3000/list/find_list_against_boardId/${boardId}`
      );
      // console.log("List Data", fetchLists());
      // console.log("resonssss", response);
      setLists(response.data);
      console.log("data", response.data);
    } catch (error) {
      console.error("❌ Error fetching lists:", error);
    }
  };
  const handleSaveCard = async (listId: number) => {
    console.log("List Id", listId);
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
      fetchLists(); // Refresh lists
    } catch (error) {
      console.error("❌ Error saving list:", error);
    }
  };
  
  return (
    <div className="relative h-screen bg-gray-100 p-8">
      {/* Add List Button */}
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

      {/* Show Lists */}
      <div className="mt-16 grid grid-cols-3 gap-4">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {list.list_name}
                </h2>
                <button
                  onClick={() =>
                    setOpenCardListId(
                      openCardListId === list.id ? null : list.id
                    )
                  }
                  className="bg-blue-400 px-2 py-2 rounded-2xl hover:bg-amber-200"
                  >
                  Add Card
                </button>
              </div>

              {/* 👇 Show card input form only for the clicked list */}
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
