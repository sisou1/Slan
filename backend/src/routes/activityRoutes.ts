import { Router } from "express";
import {
  getActivities,
  getActivity,
  getActivityParticipants,
  postActivity,
  postActivityParticipation,
  putActivity,
  removeActivity,
} from "../controllers/activityController.js";

const router = Router();

router.get("/", getActivities);
router.get("/:id", getActivity);
router.post("/", postActivity);
router.put("/:id", putActivity);
router.delete("/:id", removeActivity);

router.get("/:id/participants", getActivityParticipants);
router.post("/:id/participants", postActivityParticipation);

export default router;

