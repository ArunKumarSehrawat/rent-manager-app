import React from "react";
import { Outlet } from "react-router-dom";

const Parameters = () => {
     return (
          <>
               <div>Parameters</div>
               <Outlet />
          </>
     );
};

export default Parameters;
