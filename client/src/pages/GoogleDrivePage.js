import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";

// @mui
import { Stack, Container, Typography, CircularProgress } from "@mui/material";
import File from "src/components/file/File";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, selectFile } from "../slices/fileSlice";

export default function GoogleDrivePage() {
  // const [files, setFiles] = useState([]);

  const dispatch = useDispatch();

  const { loading, error, files } = useSelector((state) => state.files);
  const { fileSelected } = useSelector((state) => state.files);

  console.log("files--------", files);

  console.log("fileSelected--------", fileSelected);

  const getGoogleDriveFiles = async () => {
    try {
      dispatch(fetchFiles());
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title> Connect to Google Drive | Bhumio </title>
      </Helmet>

      <Container>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress color="success" />
          </div>
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Connect to Google Drive and Select Worksheet
            <Button
              onClick={getGoogleDriveFiles}
              style={{ marginLeft: 20 }}
              variant="outlined"
            >
              Select File from Google Drive
            </Button>
          </Typography>
        </Stack>
      </Container>
      <Container
        sx={{
          backgroundColor: "white",
          minHeight: "50vh",
          paddingY: 2,
          borderRadius: 2,
        }}
      >
        {fileSelected ? (
          <File
            key={fileSelected.id}
            id={fileSelected.id}
            name={fileSelected.name}
            selected={true}
          />
        ) : files?.length > 0 ? (
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="start"
          >
            {files?.map((file) => (
              <File key={file.id} id={file.id} name={file.name} />
            ))}
          </Stack>
        ) : (
          <Typography variant="p">
            No files here ! Please select files from google drive.{" "}
          </Typography>
        )}
      </Container>
    </>
  );
}
