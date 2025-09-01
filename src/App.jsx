import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Home, Register, Login, Dashboard, MyAccount, ChangePassword, NOTFOUND } from "./pages/views"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={ (<ProtectedRoute ><Dashboard/></ProtectedRoute>) } />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
        <Route path="*" element={<NOTFOUND />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
