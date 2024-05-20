import db from "../db/index.js";

const patientRegister = (req, res) => {
  const { PatientName, RefId, Address, Email, PhoneNo, Password } = req.body;

  if (!PatientName) {
    return res.status(400).json({ msg: "Name is required" });
  }

  if (!Address || Address.length < 10) {
    return res.status(400).json({ msg: "Address is too short. Must be greater than 10 characters" });
  }

  if (!Email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  if (!Email.includes("@")) {
    return res.status(400).json({ msg: "Email must contain an '@' character" });
  }

  const phoneRegex = /^\+\d{10,}$/;
  if (!PhoneNo || !phoneRegex.test(PhoneNo)) {
    return res.status(400).json({
      msg: "Phone number must be at least 10 digits long and include the country code",
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
  if (!Password || !passwordRegex.test(Password)) {
    return res.status(400).json({
      msg: "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  const Photo = req.file?.path;

  if (!Photo) {
    return res.status(400).json({ msg: "Photo is required" });
  }

  // Query to check if the email already exists
  const checkEmailQuery = "SELECT * FROM Patients WHERE Email = ?";
  db.query(checkEmailQuery, [Email], (checkError, checkResult) => {
    if (checkError) {
      console.log("Database error during email check: ", checkError);
      return res.status(500).json({ msg: "Database error during email check" });
    }

    if (checkResult.length > 0) {
      // Email already exists
      console.log("Validation failed: Email already exists", checkResult);
      return res.status(400).json({ msg: "Email already exists" });
    }

    // If email does not exist, proceed with the insertion
    const q = "INSERT INTO Patients (PatientName, RefId, Address, Email, PhoneNo, Password, Photo) VALUES (?)";
    const values = [
      PatientName,
      RefId,
      Address,
      Email,
      PhoneNo,
      Password,
      Photo,
    ];

    // Execute the insertion query
    db.query(q, [values], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("Data has been added successfully");
    });
  });
};

export { patientRegister };
