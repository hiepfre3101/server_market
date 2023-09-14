import express  from "express";
import  authentication  from "../middleware/authentication";
import { createGlobalNotification, createUserNotification, deleteGlobalNotification, deleteUserNotification, updateGlobalNotification } from "../controller/notification";

const router = express.Router();
router.post("/notification/user", authentication, createUserNotification )
router.delete("/notification/user/:id", authentication, deleteUserNotification )
router.post("/notification/global", authentication, createGlobalNotification)
router.patch("/notification/global/:id", authentication, updateGlobalNotification)
router.delete("/notification/global/:id", authentication, deleteGlobalNotification)
export default router;