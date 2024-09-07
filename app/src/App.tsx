import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Projects from "./pages/projects";
import Tasks from "./pages/tasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId/tasks" element={<Tasks />} />
    </Routes>
  );
}

export default App;
