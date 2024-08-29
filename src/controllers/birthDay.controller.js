// import User from "../../../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Birthday from "../models/birthDay.model.js";

export const getAllBirthdays = asyncHandler(async (req, res) => {
  const birthdays = await Birthday.find()
    .populate("user", "name designation.name email avatarUrl")
    .populate("wishes.user", "name designation.name email avatarUrl");;

  res
    .status(200)
    .json(
      new ApiResponse(200, birthdays, "All birthdays fetched successfully")
    );
});

export const getTodaysBirthdays = asyncHandler(async (req, res) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const users = await Birthday.find({ month, day })
    .populate("user", "name designation.name email avatarUrl")
    .populate("wishes.user", "name designation.name email avatarUrl");

  if (users.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, users, "No Birthdays today"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Todays Birthdays Fetched successfully"));
});

export const getYesterdayBirthdays = asyncHandler(async (req, res) => {
  const today = new Date();

  today.setDate(today.getDate() - 1);

  const month = today.getMonth() + 1;
  const day = today.getDate();

  const users = await Birthday.find({ month, day })
    .populate("user", "name designation.name email avatarUrl")
    .populate("wishes.user", "name designation.name email avatarUrl");

  if (users.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, users, "No birthdays yesterday"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, users, "Yesterday's birthdays fetched successfully")
    );
});

export const getTomorrowsBirthdays = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);

  const month = today.getMonth() + 1;
  const day = today.getDate();

  const users = await Birthday.find({ month, day })
    .populate({
      path: "user",
      select: "name email avatarUrl",
      populate: {
        path: "designation",
        select: "name",
      },
    })
    .populate({
      path: "wishes.user",
      select: "name email avatarUrl designation",
      populate: {
        path: "designation",
        select: "name",
      },
    });

  if (users.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, users, "No Birthdays tomorrow"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, users, "Tomorrow's birthdays fetched successfully")
    );
});

export const getUpcomingBirthdays = asyncHandler(async (req, res) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const users = await Birthday.find({
    $or: [
      { month: { $gt: currentMonth } },
      { month: currentMonth, day: { $gt: currentDay } },
    ],
  })
    .populate("user", "name designation.name email avatarUrl")
    .populate("wishes.user", "name designation.name email avatarUrl");
    
    if (users.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, users, "No Upcoming Birthdays today"));
    }

        res
          .status(200)
          .json(
            new ApiResponse(
              200,
              users,
              "Upcoming birthdays fetched successfully"
            )
          );

});

export const getPassedBirthdays = asyncHandler(async (req, res) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const users = await Birthday.find({
    $or: [
      { month: { $lt: currentMonth } },
      { month: currentMonth, day: { $lt: currentDay } },
    ],
  })
    .populate("user", "name designation.name email avatarUrl")
    .populate("wishes.user", "name designation.name email avatarUrl");

  if (users.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, users, "No Birthdays Passed"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, users, "Upcoming birthdays fetched successfully")
    );
});

