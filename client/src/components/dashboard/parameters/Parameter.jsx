import React from "react";
import { useParams } from "react-router-dom";

const Parameter = () => {
     const { parameter } = useParams();
     return <div>{parameter}</div>;
};

export default Parameter;
