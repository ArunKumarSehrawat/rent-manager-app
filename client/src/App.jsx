import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import HomePage from "./components/home/HomePage";
import Contact from "./components/contact/Contact";
import Dashboard from "./components/dashboard/Dashboard";

const App = (props) => {
     return (
          <Router>
               <Routes>
                    <Route path="/" element={<Navbar />}>
                         <Route path="/" element={<HomePage />} />
                         <Route path="login" element={<Login />} />
                         <Route path="register" element={<Register />} />
                         <Route path="contact" element={<Contact />} />
                         <Route path="*" element={<HomePage />} />
                    </Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
               </Routes>
          </Router>
     );
};

export default App;
