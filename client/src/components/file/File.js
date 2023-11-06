import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useDispatch } from "react-redux";
import { selectFile } from "../../slices/fileSlice";
import { Check } from "@mui/icons-material";

const File = ({ id, name, selected }) => {
  const dispatch = useDispatch();

  const selectFileFromDrive = (id, name) => {
    try {
      dispatch(selectFile({ id, name }));
    } catch (err) {
      console.error("Error Selecting files:", err);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 150,
          height: 150,
          background: selected && "white",
          border: selected ? "2px solid green" : "none",
          marginX: selected && "auto",
        }}
      >
        <CardActionArea
          onClick={() => (selected ? null : selectFileFromDrive(id, name))}
          sx={{ ":hover": { color: "green" } }}
        >
          <CardMedia
            component="img"
            sx={{ padding: 1, height: 80, objectFit: "contain" }}
            image="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg"
          />
          <CardContent>
            <Typography
              className="text-center"
              gutterBottom
              variant="h6"
              component="div"
            >
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {selected && (
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{textAlign:"center", color:"green", display:"flex", flex:"row", justifyContent:"center", marginTop:1}}
        >
          <Check />  Selected
        </Typography>
      )}
    </>
  );
};

export default File;
