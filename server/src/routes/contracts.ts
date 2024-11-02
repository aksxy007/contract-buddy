import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { detectAndConfirmContractType,analyzeContract, uploadMiddleware, getUserContract, getContractByID, deleteContractById } from "../controllers/contract.controller";
import { handleErrors } from "../middleware/errors";

const router = express.Router();

router.post(
  "/detect-type",
  isAuthenticated,
  uploadMiddleware,
  handleErrors(detectAndConfirmContractType)
);


router.post(
    "/analyze",
    isAuthenticated,
    uploadMiddleware,
    handleErrors(analyzeContract)
  );

  router.get(
    "/user-contracts",
    isAuthenticated,
    handleErrors(getUserContract)
  );

  router.get(
    "/contract/:id",
    isAuthenticated,
    handleErrors(getContractByID)
  );

  router.delete(
    "/delete-contract/:id",
    isAuthenticated,
    handleErrors(deleteContractById)
  )

export default router