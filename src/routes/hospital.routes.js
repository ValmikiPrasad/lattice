import { Router } from "express";
import { getHospital } from "../controllers/hospitals.controller.js";
import { patientRegister } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
// get all hospitals

router.route("/hospital").post(getHospital);
router.route("/patient/register").post(upload.single('Photo'),patientRegister)
// router.route("/doctors").get(allDoctors)
export default router;