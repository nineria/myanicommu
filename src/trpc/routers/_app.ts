import { createTRPCRouter } from "../init";
import { announcementRouter } from "./announcement";
import { commentRouter } from "./comment";
import { homePostRouter } from "./home-post";
import { postRouter } from "./post";
import { reportRouter } from "./report";
import { uploadRouter } from "./upload";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
  announcement: announcementRouter,
  homePost: homePostRouter,
  report: reportRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
