// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import Register from "./components/Register";
import WorkflowsComponent from "./WorkflowsComponent";
import UserComponent from "./UserComponent";
import Document from "./document";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/registre" element={<Register />} />
        <Route path="/workflow" element={<WorkflowsComponent />} />
        <Route path="/users" element={<UserComponent />} />
        <Route path="/document" element={<Document />} />

      </Routes>
    </Router>
  );
};

export default App;
