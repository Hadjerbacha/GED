// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import Register from "./components/Register";
import WorkflowsComponent from "./WorkflowsComponent";
import UserComponent from "./UserComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/registre" element={<Register />} />
        <Route path="/workflow" element={<WorkflowsComponent />} />
        <Route path="/users" element={<UserComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
