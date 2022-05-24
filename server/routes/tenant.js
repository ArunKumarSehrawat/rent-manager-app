import express from "express";
export const tenantRouter = express.Router();
import {} from "../controller/tenant.js";
import { isUserAuthorized } from "../controller/middlewares.js";

/**
 * Base Route /tenant
 */

tenantRouter.get("/all", isUserAuthorized).post("/create", isUserAuthorized).patch("/update", isUserAuthorized).delete("/delete", isUserAuthorized);
