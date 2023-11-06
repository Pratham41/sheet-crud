import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CircularProgress, Container, Grid, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, updateItem } from "src/slices/patientSlice";

const steps = [
  {
    label: "Patients Details",
    description: "Enter Patient's Details here:",
    // fields: ['PatientName(First,LastName)', "Location", "Age", "Gender", "Phone", "Address"],
    fields: [
      "PatientID",
      "PatientName(First,LastName)",
      "Location",
      "Age",
      "Gender",
      "Phone",
      "Address",
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
      "Physician Name(First,LastName)",
      "PhysicianNumber",
      "Bill",
    ],
  },
];

export default function EditPatientForm() {
  const { fileSelected } = useSelector((state) => state.files);

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({});

  const location = useLocation().state;

  const dispatch = useDispatch();

  console.log("row", location);

  const { loadingUpdate, successUpdate } = useSelector((state) => state.items);

  React.useEffect(() => {
    const data = {
      "PatientName(First,LastName)": `${location?.firstName} ${location?.lastName}`,
      Location: location?.Location,
      Age: location?.Age,
      Gender: location?.Gender,
      Phone: location?.Phone,
      Address: location?.Address,
      Prescription: location?.Prescription,
      Dose: location?.Dose,
      VisitDate: location?.VisitDate,
      NextVisit: location?.NextVisit,
      PhysicianID: location?.PhysicianID,
      "Physician Name(First,LastName)": location?.PhysicianName,
      PhysicianNumber: location?.PhysicianNumber,
      Bill: location?.Bill,
      PatientID: location?.PatientID,
      appointmentrowNum: location?.appointmentrowNum,
      patientrowNum: location?.patientrowNum,
      physicianrowNum: location?.physicianrowNum,
      prescribesrowNum: location?.prescribesrowNum,
    };
    setFormData(data);
  }, [location]);

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

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setFormData({});
  //   setErrors({});
  // };

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
  const handleFinish = () => {
    const fieldMapping = {
      "PatientName(First,LastName)": ["first_name", "last_name"],
      "Physician Name(First,LastName)": [
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

    console.log(renamedFormData);
    dispatch(updateItem({ ...renamedFormData, sheetID: fileSelected?.id }));
  };

  React.useEffect(() => {
    if (successUpdate) {
      setActiveStep(0);
      dispatch(fetchItems(fileSelected?.id));
    }
  }, [successUpdate]);

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Edit Patients
        </Typography>
      </Stack>
      {loadingUpdate && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="success" />
        </div>
      )}
      <Box>
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
                        {" "}
                        {/* Define the number of items in one line */}
                        <TextField
                          id={fieldName}
                          label={fieldName}
                          variant="outlined"
                          value={formData[fieldName] || ""}
                          onChange={(event) =>
                            handleInputChange(event, fieldName)
                          }
                          InputProps={{
                            // eslint-disable-next-line no-unneeded-ternary
                            readOnly:
                              fieldName === "PatientID" ||
                              fieldName === "PhysicianID"
                                ? true
                                : false,
                          }}
                          sx={{ mt: 2 }}
                        />
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
            <Typography>{`Want to update these details?`}</Typography>
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
    </Container>
  );
}
