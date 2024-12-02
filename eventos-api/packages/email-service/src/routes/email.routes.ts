import { Router } from "express";
import verifyAuthToken from "../middlewares/email.middleware";
import enviarEmailController from "../controllers/emailController";

const router = Router();

router.post('/send', verifyAuthToken, enviarEmailController.sendMail);


router.get("/protected", verifyAuthToken, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

export default router;
