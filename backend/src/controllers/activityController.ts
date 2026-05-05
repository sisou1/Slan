import type { NextFunction, Request, Response } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  joinActivity,
  listActivities,
  listParticipants,
  updateActivity,
} from "../services/activityService.js";

type ActivityBody = {
  name?: string;
  description?: string | null;
};

type ParticipationBody = {
  nickname?: string;
};

type ErrorWithCode = {
  code?: string;
};

function parseId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

function isDuplicateError(error: unknown): error is ErrorWithCode {
  return typeof error === "object" && error !== null && "code" in error;
}

export async function getActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await listActivities();
    res.json(activities);
  } catch (error) {
    next(error);
  }
}

export async function getActivity(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const activityId = parseId(req.params.id);
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity id" });
    }

    const activity = await getActivityById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    next(error);
  }
}

export async function postActivity(
  req: Request<Record<string, never>, unknown, ActivityBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, description } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Activity name is required" });
    }

    const activity = await createActivity({ name: name.trim(), description });
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

export async function putActivity(
  req: Request<{ id: string }, unknown, ActivityBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const activityId = parseId(req.params.id);
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity id" });
    }

    const { name, description } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Activity name is required" });
    }

    const activity = await updateActivity(activityId, { name: name.trim(), description });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    next(error);
  }
}

export async function removeActivity(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const activityId = parseId(req.params.id);
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity id" });
    }

    const deleted = await deleteActivity(activityId);
    if (!deleted) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getActivityParticipants(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const activityId = parseId(req.params.id);
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity id" });
    }

    const activity = await getActivityById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const participants = await listParticipants(activityId);
    res.json(participants);
  } catch (error) {
    next(error);
  }
}

export async function postActivityParticipation(
  req: Request<{ id: string }, unknown, ParticipationBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const activityId = parseId(req.params.id);
    if (!activityId) {
      return res.status(400).json({ message: "Invalid activity id" });
    }

    const { nickname } = req.body;
    if (!nickname || typeof nickname !== "string" || !nickname.trim()) {
      return res.status(400).json({ message: "Nickname is required" });
    }

    const activity = await getActivityById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const participant = await joinActivity(activityId, nickname.trim());
    res.status(201).json(participant);
  } catch (error) {
    if (isDuplicateError(error) && error.code === "23505") {
      return res.status(409).json({ message: "This nickname already joined the activity" });
    }
    next(error);
  }
}
