import { Router } from "express";

import {
  getAllBirthdays,
  getTodaysBirthdays,
  getYesterdayBirthdays,
  getTomorrowsBirthdays,
  getUpcomingBirthdays,
  getPassedBirthdays,
} from "../controllers/birthDay.controller.js";

import { verifyJWT, admin, hr } from "../middleware/auth.middleware.js";

const birthDayRoutes = Router();

birthDayRoutes.get("/", getAllBirthdays);
birthDayRoutes.get("/today", getTodaysBirthdays);
birthDayRoutes.get("/yesterday", getYesterdayBirthdays);
birthDayRoutes.get("/tomorrow", getTomorrowsBirthdays);
birthDayRoutes.get("/upcoming", getUpcomingBirthdays);
birthDayRoutes.get("/passed", getPassedBirthdays);

export default birthDayRoutes;
