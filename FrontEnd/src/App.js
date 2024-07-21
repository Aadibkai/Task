import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Component/LogIn/Login";
import Singup from "./Component/LogIn/Singup";
import Admin from "./Component/AdminPanel/Admin";
import Employe from "./Component/Employee/Employe";
import EmployList from "./Component/Employee/EmployList";
import Header from "./Component/Header/Header";
import Edit from "./Component/EditEmployee/Edit";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Singup />} />
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/employe" element={<Employe/>}/>
      <Route path="/employlist" element={<EmployList/>}/>
      <Route path="/heder" element={<Header/>}/>
      <Route path="/edit/:id" element={<Edit/>}/>
    </Routes>
  );
}

export default App;
