/* eslint-disable camelcase */
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
// @mui
import {
  Stack,
  Popover,
  MenuItem,
  Container,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
// components
import Iconify from "../components/iconify";
import DataTable from "../sections/DataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "src/slices/patientSlice";

export default function EditPage() {
  const [open, setOpen] = useState(null);
  const [warn, setWarn] = useState(false);
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const { fileSelected } = useSelector((state) => state.files);

  const dispatch = useDispatch();
  useEffect(() => {
    if (fileSelected) {
      if(items?.length === 0){
        dispatch(fetchItems(fileSelected?.id));
      }else{
        return
      }
    }else{
      setWarn(true)
    }
  }, [dispatch]);

  const { loading, error, items } = useSelector((state) => state.items);

  return (
    <>
      <Helmet>
        <title> Edit Patients | Bhumio </title>
      </Helmet>

      {loading && !warn && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="success" />
        </div>
      )}
      {warn && (
        <Typography align="center" color="red" variant="h4" gutterBottom>
          No file selected. Please select file
        </Typography>
      )}
      {!loading && (
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
          <TextField
            label="Search Patients"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <DataTable searchQuery={searchQuery} edit={true} rows={items} />
        </Container>
      )}
    </>
  );
}
