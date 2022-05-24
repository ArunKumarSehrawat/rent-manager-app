import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import HomePage from "./components/home/HomePage";
import Contact from "./components/contact/Contact";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/dashboard/Home";
import Years from "./components/dashboard/years/Years";
import Year from "./components/dashboard/years/Year";
import Tenants from "./components/dashboard/tenants/Tenants";
import Tenant from "./components/dashboard/tenants/Tenant";
import Parameters from "./components/dashboard/parameters/Parameters";
import Parameter from "./components/dashboard/parameters/Parameter";

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
                    <Route path="/dashboard" element={<Dashboard />}>
                         {/* <Route path="/dashboard/" element={<Home />} /> */}
                         <Route path="home" element={<Home />} />
                         <Route path="years" element={<Years />}>
                              <Route path=":year" element={<Year />} />
                         </Route>
                         <Route path="tenants" element={<Tenants />}>
                              <Route path=":tenant" element={<Tenant />} />
                         </Route>
                         <Route path="parameters" element={<Parameters />}>
                              <Route path=":parameter" element={<Parameter />} />
                         </Route>
                         <Route path="*" element={<Home />} />
                    </Route>
               </Routes>
          </Router>
     );
};

export default App;
