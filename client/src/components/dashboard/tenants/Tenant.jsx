import React from "react";
import { useParams } from "react-router-dom";

const Tenant = () => {
     const { tenant } = useParams();
     return <div>{tenant}</div>;
};

export default Tenant;
