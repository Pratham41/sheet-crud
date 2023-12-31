import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CircularProgress, Container, Grid, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import IDGenerater from "../../utils/IdGenerater";
import { useDispatch, useSelector } from "react-redux";
import { createItem, fetchItems } from "src/slices/patientSlice";

const steps = [
  {
    label: "Patients Details",
    description: "Enter Patient's Details here:",
    fields: [
      "PatientName(First,Last Name)",
      "Location",
      "Age",
      "Gender",
      "Phone",
      "Address",
      "PatientID",
    ],
  },
  {
    label: "Prescription Related Details",
    description: "Enter Patient's Prescription Details here:",
    fields: ["Prescription", "Dose", "VisitDate", "NextVisit"],
  },
  {
    label: "Physician Details",
    description: "Enter Physician Details here:",
    fields: [
      "PhysicianID",
      "PhysicianName(First,LastName)",
      "PhysicianNumber",
      "Bill",
    ],
  },
];

export default function PatientForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({});
  const [DrId, setDrId] = useState(null);
  const [PatientID, setPatientID] = useState(null);
  const [ApointmentID, setApointmentID] = useState(null);

  const dispatch = useDispatch();

  const { loadingAdd, successAdd } = useSelector((state) => state.items);

  const { fileSelected } = useSelector((state) => state.files);

  const generateID = () => {
    setDrId("dr" + Math.floor(Math.random() * 1000) + 1);
    setPatientID("pt" + Math.floor(Math.random() * 1000) + 1);
    setApointmentID("ap" + Math.floor(Math.random() * 1000) + 1);
    formData["ApointmentID"] = ApointmentID || "";
    formData["PhysicianID"] = DrId || "";
    formData["PatientID"] = PatientID || "";
  };

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    // Validate the fields before proceeding to the next step
    if (validateFields()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;

    // Check if the field name is 'field1' and the value contains only numbers
    if (
      fieldName === "Age" ||
      fieldName === "Phone" ||
      fieldName === "PhysicianNumber"
    ) {
      if (fieldName === "Age" && Number.isNaN(Number(value))) {
        setErrors({
          ...errors,
          [fieldName]: `${fieldName} should contain only numbers.`,
        });
        return;
      }
      if (
        (fieldName === "Phone" || fieldName === "PhysicianNumber") &&
        Number.isNaN(Number(value))
      ) {
        setErrors({
          ...errors,
          [fieldName]: `${fieldName} should contain only numbers.`,
        });

        return;
      }
    }

    // Handle invalid input for 'field1' (e.g., show an error message)
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    steps[activeStep].fields.forEach((fieldName) => {
      if (!formData[fieldName]) {
        newErrors[fieldName] = "This field is required.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  console.log(formData);
  const handleFinish = async () => {
    const fieldMapping = {
      "PatientName(First,Last Name)": ["first_name", "last_name"],
      "PhysicianName(First,LastName)": [
        "Physician_first_name",
        "Physician_last_name",
      ],
    };

    const renamedFormData = {};

    Object.keys(formData).forEach((oldField) => {
      if (fieldMapping[oldField]) {
        const [newField1, newField2] = fieldMapping[oldField];
        const [firstName, lastName] = formData[oldField].split(" ");
        renamedFormData[newField1] = firstName || "";
        renamedFormData[newField2] = lastName || "";
      } else {
        renamedFormData[oldField] = formData[oldField];
      }
    });
    const ApointmentID = await IDGenerater(455, "ap");
    formData["ApointmentID"] = ApointmentID || "";
    dispatch(createItem({ ...renamedFormData, sheetID: fileSelected?.id }));
    console.log(renamedFormData);
  };

  React.useEffect(() => {
    if (!DrId || !PatientID || !ApointmentID) {
      console.log("hey");
      formData["ApointmentID"] = "ap" + Math.floor(Math.random() * 1000) + 1;
      formData["PhysicianID"] = "dr" + Math.floor(Math.random() * 1000) + 1;
      formData["PatientID"] = "pt" + Math.floor(Math.random() * 1000) + 1;
      setDrId(formData["PhysicianID"]);
      setPatientID(formData["PhysicianID"]);
      setApointmentID(formData["ApointmentID"]);
    }
  }, [ApointmentID, DrId, PatientID, formData]);

  React.useEffect(() => {
    if (successAdd) {
      dispatch(fetchItems(fileSelected?.id));
      setFormData({});
      setActiveStep(0);
    }
  }, [successAdd]);

  return (
    <Box>
      {loadingAdd && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="success" />
        </div>
      )}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 5 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <form>
                {/* <Container sx={{ display: "flex", flexDirection: ["column", "column", 'row'], justifyContent: "center", alignItems: "center" }}> */}

                <Grid container spacing={2}>
                  {" "}
                  {/* Use Grid container */}
                  {step.fields.map((fieldName) => (
                    <Grid item xs={4} key={fieldName}>
                      {/* Define the number of items in one line */}
                      {fieldName === "Gender" ? (
                        <TextField
                          select
                          id={fieldName}
                          label={fieldName}
                          variant="outlined"
                          value={formData[fieldName] || ""}
                          onChange={(event) =>
                            handleInputChange(event, fieldName)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ mt: 2 }}
                          style={{ width: "70%" }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                      ) : (
                        <TextField
                          id={fieldName}
                          style={{ width: "70%" }}
                          label={fieldName}
                          variant="outlined"
                          value={formData[fieldName] || ""}
                          onChange={(event) =>
                            handleInputChange(event, fieldName)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ mt: 2 }}
                          InputProps={{
                            // eslint-disable-next-line no-unneeded-ternary
                            readOnly:
                              fieldName === "PatientID" ||
                              fieldName === "PhysicianID"
                                ? true
                                : false,
                          }}
                          type={
                            fieldName === "VisitDate" ||
                            fieldName === "NextVisit"
                              ? "date"
                              : "text"
                          }
                        />
                      )}
                      <Typography style={{ color: "red" }}>
                        {errors[fieldName]}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* </Container> */}
              </form>
              <Box sx={{ mb: 2 }}>
                <Container>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Container>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>{`Want to save these details?`}</Typography>
          <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
          <Button
            onClick={handleFinish}
            sx={{ mt: 1, mr: 1 }}
            variant="contained"
          >
            Save
          </Button>
        </Paper>
      )}
    </Box>
  );
}
