import FooterComponent from "./Components/FooterComponent";
import HeaderComponent from "./Components/HeaderComponent";
import ListEmployeComponent from "./Components/ListEmployeComponent";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeComponent from "./Components/EmployeComponent";
function App() {
  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          {/* // https://localhost:3000 */}
          <Route path="/" element={<ListEmployeComponent />}></Route>
          {/* // https://localhost:3000/employees */}
          <Route path="/employees" element={<ListEmployeComponent />}></Route>
          {/* // https://localhost:3000/addEmploye */}
          <Route path="/addEmploye" element={<EmployeComponent />}></Route>
          {/* // https://localhost:3000/editEmploye/1 */}
          <Route
            path="/editEmploye/:id"
            element={<EmployeComponent></EmployeComponent>}
          ></Route>
        </Routes>

        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
