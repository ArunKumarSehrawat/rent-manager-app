import express from "express";
export const ownerRouter = express.Router();

import { getAllYears, deleteAllYears, getOneYear, createOneYear, deleteOneYear, updateOneYear } from "../controller/owner.js";
import { isUserAuthorized } from "../controller/middlewares.js";

/**
 * Base Route /owner
 */

ownerRouter.route("/years").get(isUserAuthorized, getAllYears).delete(isUserAuthorized, deleteAllYears);
ownerRouter.route("/years/:year").get(isUserAuthorized, getOneYear).post(isUserAuthorized, createOneYear).delete(isUserAuthorized, deleteOneYear).patch(isUserAuthorized, updateOneYear);
