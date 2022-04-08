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
                    <Route
                         path="/"
                         element={
                              <>
                                   <Navbar />
                                   <HomePage />
                              </>
                         }
                    />
                    <Route
                         path="/login"
                         element={
                              <>
                                   <Navbar />
                                   <Login />
                              </>
                         }
                    />
                    <Route
                         path="/register"
                         element={
                              <>
                                   <Navbar />
                                   <Register />
                              </>
                         }
                    />
                    <Route
                         path="/contact"
                         element={
                              <>
                                   <Navbar />
                                   <Contact />
                              </>
                         }
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<h1>404 not found</h1>} />
               </Routes>
          </Router>
     );
};

export default App;
