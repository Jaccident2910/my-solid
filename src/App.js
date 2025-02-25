import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login'
import ApiTest from './pages/ApiTest'
import { SessionProvider } from "@inrupt/solid-ui-react";

function App() {
  return (
    <SessionProvider sessionId="mySolid">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/api" element={<ApiTest />}></Route>
      </Routes>
    </SessionProvider>
  );
}

export default App;
