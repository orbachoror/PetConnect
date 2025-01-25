import CircularProgress from "@mui/material/CircularProgress";
function Loader() {
  return (
    <CircularProgress
      style={{ position: "absolute", top: "50%", left: "50%" }}
    />
  );
}

export default Loader;
