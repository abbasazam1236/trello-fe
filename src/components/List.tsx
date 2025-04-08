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
  console.log("board_Id", boardId);
  const [lists, setLists] = useState<ListItem[]>([]); // ✅ Use ListItem type
  const [isOpen, setIsOpen] = useState(false);
  const [listName, setListName] = useState("");

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
      console.log("resonssss", response);
      setLists(response.data);
      console.log("data", response.data);
    } catch (error) {
      console.error("❌ Error fetching lists:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/list/${boardId}`,
        {
          list_name: listName,
        }
      );
      console.log("✅ List Saved:", response.data);
      setIsOpen(false);
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
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-700"
      >
        Add List
      </button>

      {/* Mini Modal */}
      {isOpen && (
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
              onClick={handleSave}
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
            <div
              key={list.id}
              className="bg-white p-4 rounded-lg shadow-md text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {list.list_name}
              </h2>
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
