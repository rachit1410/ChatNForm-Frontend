import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Home, Register, Login, Dashboard } from "./pages/views"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={ (<ProtectedRoute ><Dashboard/></ProtectedRoute>) } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
