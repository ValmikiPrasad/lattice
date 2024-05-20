import db from "../db/index.js";

const getHospital = async (req, res) => {
  const { id } = req.body;

  const hospitalQuery = `
    SELECT 
      Hospitals.id AS HospitalID,
      Hospitals.HospitalName,
      COUNT(Doctors.DoctId) AS TotalPsychiatrists
    FROM 
      Hospitals
    JOIN 
      Doctors ON Doctors.HostId = Hospitals.id
    WHERE 
      Hospitals.id = ?`;

  const psychiatristsQuery = `
      SELECT 
     DoctId,DoctorName,COUNT(PatientId) AS TotalPatients
    FROM 
      Patients
    JOIN 
      Doctors ON Doctors.DoctId = Patients.RefId WHERE HostId=? GROUP BY DoctorName ,DoctId`;

  try {
    db.query(hospitalQuery, [id], (err1, hospitalData) => {
      if (err1) {
        return res.status(500).json({ msg: "Internal Server Error,er1" });
      }

      if (hospitalData.length === 0) {
        return res.status(404).json({ msg: "Hospital not found" });
      }

      db.query(psychiatristsQuery,[id], (err2, psychiatristsData) => {
        if (err2) {
          return res
            .status(500)
            .json({ msg: "Internal Server Error,err2", hospitalData });
        }

        res
          .status(200)
          .json({ hospital: hospitalData, psychiatrists: psychiatristsData });
      });
    });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ msg: "Internal Server Error,last" });
  }
};

export { getHospital };
