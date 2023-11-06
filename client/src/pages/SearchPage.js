import { Helmet } from "react-helmet-async";

import { Card, Stack, Container, Typography, CircularProgress } from "@mui/material";
import Searchbar from "../layouts/dashboard/header/Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchItems } from "src/slices/patientSlice";
import DataTable from "src/sections/DataTable/DataTable";
// components
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const { fileSelected } = useSelector((state) => state.files);
  const { loading, error, items } = useSelector((state) => state.items);


  const dispatch = useDispatch();
  useEffect(() => {
    if (fileSelected) {
      if(items?.length ===0 ){
        dispatch(fetchItems(fileSelected?.id));
      }else{
        return
      }
    }
  }, [dispatch]);


  return (
    <>
      <Helmet>
        <title> Search Patients | Bhumio </title>
      </Helmet>
      {loading && fileSelected && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="success" />
        </div>
      )}

      {!fileSelected ? (
        <Typography align="center" color="red" variant="h4" gutterBottom>
          No file selected. Please select file
        </Typography>
      ) : (
        <Container>
          <Searchbar handleSearchChange={handleSearchChange} />
          <DataTable searchQuery={searchQuery} edit={false} rows={items} />
        </Container>
      )}
    </>
  );
}
