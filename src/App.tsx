import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import List from "./components/List";
import Board from "./components/Board";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board />} />
        {/* <Route path="/board" element={<Board />} /> */}
        <Route path="/list/:boardId" element={<List />} />

      </Routes>
    </Router>
  );
}

export default App;
