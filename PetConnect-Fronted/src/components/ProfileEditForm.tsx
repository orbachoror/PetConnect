import React from "react";
import { Grid, TextField, Avatar, Button } from "@mui/material";
import { SenteziedUserType } from "../types/User";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditFormProps {
  userDetails: SenteziedUserType;
  setUserDetails: (details: SenteziedUserType) => void;
  onPictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
  onSave: (values: SenteziedUserType) => void;
  onCancel: () => void;
  baseUrl: string;
}

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .nullable()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .min(10, "Phone number must be at least 10 digits")
    .notRequired(),
  address: Yup.string().nullable().notRequired(),
  dateOfBirth: Yup.date().nullable().notRequired(),
});

const EditForm: React.FC<EditFormProps> = ({
  userDetails,
  setUserDetails,
  onPictureChange,
  preview,
  onSave,
  onCancel,
  baseUrl,
}) => {
  const formik = useFormik({
    initialValues: {
      name: userDetails.name || "",
      email: userDetails.email || "",
      phone: userDetails.phone || "",
      address: userDetails.address || "",
      dateOfBirth: userDetails.dateOfBirth || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values); // Pass validated form data to the parent component
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
    formik.setFieldValue(name, value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {/* Avatar with Picture Upload */}
        <Grid item xs={12}>
          <Avatar
            src={
              preview ||
              (userDetails.profilePicture
                ? `${baseUrl}/${userDetails.profilePicture}`
                : undefined)
            }
            alt="Profile Picture"
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              border: "4px solid #90caf9",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
            }}
            onClick={() =>
              document.getElementById("profilePictureInput")?.click()
            }
          />
          <input
            type="file"
            id="profilePictureInput"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={onPictureChange}
          />
        </Grid>

        {/* Name Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={handleInputChange} // Use custom handleInputChange
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        {/* Email Field (Read-Only) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            InputProps={{
              readOnly: true, // Makes the field read-only
            }}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        {/* Phone Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={handleInputChange} // Use custom handleInputChange
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        {/* Address Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formik.values.address}
            onChange={handleInputChange} // Use custom handleInputChange
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        {/* Date of Birth Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formik.values.dateOfBirth}
            onChange={handleInputChange} // Use custom handleInputChange
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        {/* Save and Cancel Buttons */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditForm;
