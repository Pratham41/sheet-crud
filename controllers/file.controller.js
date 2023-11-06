const createDriveClient = require("../middlewares/auth");
const { google } = require("googleapis");
const { converInProperFormat } = require("../utils/files.utils");

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/spreadsheets",
];

const getAllFiles = async (req, res) => {
  try {
    const { driveClient } = await createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    );
    const response = await driveClient.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
      corpora: "user",
    });

    const files = response.data.files;
    return res.status(200).json(files);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};


const getSheet = async (req, res) => {
  try {
    const { sheetID } = req.params
    const { client, sheetClient } = await createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    );
    const { data: patients } = await sheetClient.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetID,
      range: "patient",
    });
    const { data: physicians } = await sheetClient.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetID,
      range: "physician",
    });
    const { data: prescription } = await sheetClient.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetID,
      range: "prescribes",
    });
    const { data: appointment } = await sheetClient.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetID,
      range: "appointment",
    });
    const patientData = patients.values;
    const physicianData = physicians.values;
    const prescriptionData = prescription.values;
    const appointmentData = appointment.values;

    const response = {
      patients: converInProperFormat(patientData, "patient"),
      physician: converInProperFormat(physicianData, "physician"),
      prescriptions: converInProperFormat(prescriptionData, "prescribes"),
      appointment: converInProperFormat(appointmentData, "appointment"),
    };

    const mergedArray = response.patients.map((obj1) => {
      const matchingObj2 = response.prescriptions.find(
        (obj2) => obj1.ssn === obj2.PatientID
      );
      const matchingObj3 = response.appointment.find(
        (obj2) => obj1.ssn === obj2.patientID
      );
      const matchingObj4 = response.physician.find(
        (obj2) => matchingObj2.physician === obj2.employeeid
      );
      if (matchingObj2 && matchingObj3) {
        return {
          firstName: obj1.first_name,
          lastName: obj1.last_name,
          Location: obj1.location,
          Age: obj1.age,
          Phone: obj1.phone,
          Gender: obj1.gender,
          Address: obj1.address,
          Prescription: matchingObj2.description,
          Dose: matchingObj2.dose,
          PhysicianID: matchingObj2.physician,
          Bill: matchingObj3.bill,
          VisitDate: matchingObj3.start_dt_time,
          NextVisit: matchingObj3.next_dt_time,
          PhysicianName: matchingObj4.name,
          PhysicianNumber: matchingObj4.phone,
          Email: obj1.email,
          PatientID: matchingObj3.patientID,
          AppointmentID: matchingObj3.appointmentID,
          patientrowNum: obj1.patientrowNum,
          physicianrowNum: matchingObj4.physicianrowNum,
          prescribesrowNum: matchingObj2.prescribesrowNum,
          appointmentrowNum: matchingObj3.appointmentrowNum,
        };
      }
    });
    const finalData = mergedArray.filter((m) => m !== undefined);

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const updateSheetData = async (req, res) => {
  try {
    const { sheetID } = req.params
    console.log('sheetID',sheetID);
    const {
      ApointmentID,
      PhysicianID,
      PatientID,
      first_name,
      last_name,
      Location,
      Age,
      Gender,
      Phone,
      Address,
      Dose,
      Prescription,
      VisitDate,
      NextVisit,
      Physician_first_name,
      Physician_last_name,
      PhysicianNumber,
      Bill,
      patientrowNum,
      physicianrowNum,
      prescribesrowNum,
      appointmentrowNum
    } = req.body;

    console.log('hhgvgvhv',req.body);

    const { client, sheetClient } = await createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    );

      const updateData = await Promise.all([
        sheetClient.spreadsheets.values.update({
          auth: client,
          spreadsheetId: sheetID,
          range: `patient!A${patientrowNum + 2}:Z${patientrowNum + 2}`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [
                PatientID,
                first_name,
                last_name,
                Address,
                Location,
                Phone,
                Age,
                Gender,
              ],
            ],
          },
        }),
  
        sheetClient.spreadsheets.values.update({
          auth: client,
          spreadsheetId: sheetID,
          range: `prescribes!A${prescribesrowNum + 2}:Z${prescribesrowNum + 2}`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [
                PhysicianID,
                PatientID,
                Prescription,
                Dose,
              ],
            ],
          },
        }),
  
          sheetClient.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetID,
            range: `appointment!A${appointmentrowNum + 2}:Z${appointmentrowNum + 2}`,
            valueInputOption: "USER_ENTERED",
            resource:{
              values:     [ [
                ApointmentID,PatientID,PhysicianID, VisitDate, NextVisit,Bill
              ]]
            }
          }),
  
          sheetClient.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetID,
            range: `physician!A${physicianrowNum + 2}:Z${physicianrowNum + 2}`,
            valueInputOption: "USER_ENTERED",
            resource:{
              values:     [ [
                PhysicianID, Physician_first_name + " " +Physician_last_name, PhysicianNumber
              ]]
            }
          }),
      ]);
      return res.status(201).json(updateData);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const addSheetData = async (req, res) => {
  try {
    const { sheetID } = req.params
    const {
      ApointmentID,
      PhysicianID,
      PatientID,
      first_name,
      last_name,
      Location,
      Age,
      Gender,
      Phone,
      Address,
      Dose,
      Prescription,
      VisitDate,
      NextVisit,
      Physician_first_name,
      Physician_last_name,
      PhysicianNumber,
      Bill,
    } = req.body;
    const { client, sheetClient } = await createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    );

    const addData = await Promise.all([
      sheetClient.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetID,
        range: `patient`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            [
              PatientID,
              first_name,
              last_name,
              Address,
              Location,
              Phone,
              Age,
              Gender,
            ],
          ],
        },
      }),

      sheetClient.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetID,
        range: `prescribes`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            [
              PhysicianID,
              PatientID,
              Prescription,
              Dose,
            ],
          ],
        },
      }),

        sheetClient.spreadsheets.values.append({
          auth: client,
          spreadsheetId: sheetID,
          range: `appointment`,
          valueInputOption: "USER_ENTERED",
          resource:{
            values:     [ [
              ApointmentID,PatientID,PhysicianID, VisitDate, NextVisit,Bill
            ]]
          }
        }),

        sheetClient.spreadsheets.values.append({
          auth: client,
          spreadsheetId: sheetID,
          range: `physician`,
          valueInputOption: "USER_ENTERED",
          resource:{
            values:     [ [
              PhysicianID, Physician_first_name + " " +Physician_last_name, PhysicianNumber
            ]]
          }
        }),
    ]);
    console.log(req.body);
    return res.status(201).json(addData);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  getAllFiles,
  getSheet,
  updateSheetData,
  addSheetData,
};
