import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import HomePage from "./components/home/HomePage";
import Contact from "./components/contact/Contact";
import Dashboard from "./components/dashboard/Dashboard";

const App = (props) => {
     return (
          <>
               <Navbar />
               <Router>
                    <Routes>
                         <Route path="/" element={<HomePage />} />
                         <Route path="/login" element={<Login />} />
                         <Route path="/register" element={<Register />} />
                         <Route path="/contact" element={<Contact />} />
                         <Route path="/dashboard" element={<Dashboard />} />
                         <Route path="*" element={<h1>404 not found</h1>} />
                    </Routes>
               </Router>
          </>
     );
};

export default App;
