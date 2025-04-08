import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Define a type for a Board
interface BoardItem {
  id: number;
  board_title: string;
  workspace: string;
  visibility: string;
}

const Board = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [boards, setBoards] = useState<BoardItem[]>([]); // ✅ Use BoardItem type
  const [formData, setFormData] = useState<BoardItem>({
    id: 0,
    board_title: "",
    workspace: "",
    visibility: "",
  });

  const navigate = useNavigate(); // ✅ For navigation

  // ✅ Fetch boards from API
  useEffect(() => {
    const fetchBoards = async () => {
        try {
            const response = await axios.get<BoardItem[]>("http://localhost:3000/boards/find_all_board");
            setBoards(response.data); // Store boards
            console.log('cuss', response);
        } catch (error) {
            console.error("❌ Error fetching boards:", error);
        }
    };
    console.log(fetchBoards());
    fetchBoards();
  }, []);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle save
  const handleSave = async () => {
    try {
      const response = await axios.post<BoardItem>("http://localhost:3000/boards/add_Board", formData);
      console.log("✅ Data Saved Successfully:", response.data);
      setIsOpen(false);
      setBoards([...boards, response.data]); // Update board list
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Create Board Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-2xl"
      >
        Board
      </button>

      {/* ✅ Boards List (Centered) */}
      <div className="bg-white px-32 py-16 rounded-xl shadow-lg w-3/4 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Boards</h2>
        {boards.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 w-full">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/list/${board.id}`)}
                className="bg-blue-500 text-white text-lg font-medium p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:shadow-lg flex justify-center items-center"
              >
                {board.board_title}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No boards found.</p>
        )}
      </div>

      {/* ✅ Modal for Creating Board */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create Board</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-600">
                ✖
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                name="board_title"
                placeholder="Board Title"
                value={formData.board_title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="workspace"
                placeholder="Workspace"
                value={formData.workspace}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="visibility"
                placeholder="Visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
