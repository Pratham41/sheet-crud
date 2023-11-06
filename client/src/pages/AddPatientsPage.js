import { Stack, Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PatientForm from "../sections/Form/PatientForm";
import { useSelector } from "react-redux";

export default function AddPatientsPage() {
  const { fileSelected } = useSelector((state) => state.files);


  return (
    <>
      <Helmet>
        <title> Add Patients | Bhumio </title>
      </Helmet>
      {!fileSelected ? (
        <Typography align="center" color="red" variant="h4" gutterBottom>
          No file selected. Please select file
        </Typography>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Add Patients Form
            </Typography>
          </Stack>
          <PatientForm />
        </>
      )}
    </>
  );
}
