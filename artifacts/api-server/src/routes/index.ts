import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import postsRouter from "./posts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(postsRouter);

export default router;
