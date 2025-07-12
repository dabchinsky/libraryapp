import { Router } from "express";
import controller from "./books-controller.js";
import upload from "../../multer.js";

const router = Router();

router.get("/", controller.getBooks);
router.get("/:id", controller.getBook);
router.get('/cover/:id', controller.getCover);

router.post("/upload", upload.fields([{ name: "cover", maxCount: 1 }]), controller.uploadBook);

router.patch("/reorder", controller.reorderBooks)

export default router;
