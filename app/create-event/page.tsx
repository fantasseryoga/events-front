"use client";

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Grid } from "@mui/material";
import { CityInterface } from "@/interfaces/city/city.interface";
import { CategoryInterface } from "@/interfaces/category/category.interface";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AppNavbar from "@/components/AppBar";
import { cleanObject } from "@/utils/common/clean-object";
import { EventCreationalInerface } from "@/interfaces/event/event-creational.interface";
import { EventExceptionsEnum } from "@/enums/exception/event-exceptions.enum";
import { CommonExceptionsEnum } from "@/enums/exception/common-exceptions.enum";
import { EventMessagesEnum } from "@/enums/success-messages/event-messages.enum";
import { CityRoutes } from "@/enums/routes/city-routes.enum";
import { CategoryRoutes } from "@/enums/routes/categories-routes.enum";
import { EventsRoutes } from "@/enums/routes/events-routes.enum";

const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = useState<EventCreationalInerface>({
    title: "",
    address: "",
    selectedCity: null as CityInterface | null,
    selectedCategories: [] as CategoryInterface[],
    eventDate: null as Date | null,
    description: ""
  });

  const [cities, setCities] = useState<CityInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch(CityRoutes.List);
      const data = await response.json();
      setCities(data);
    };

    const fetchCategories = async () => {
      const response = await fetch(CategoryRoutes.List);
      const data = await response.json();
      setCategories(data);
    };

    fetchCities();
    fetchCategories();
  }, []);

  const validateForm = () => {
    let formErrors: any = {};
    if (formData.title.length < 3) formErrors.title = EventExceptionsEnum.TitleToShort;
    if (formData.address.length < 3) formErrors.address = EventExceptionsEnum.AddressToShort;
    if (!formData.selectedCity) formErrors.selectedCity = EventExceptionsEnum.CityIsRequired;
    if (formData.selectedCategories.length < 2) formErrors.selectedCategories = EventExceptionsEnum.CategoryMinLength;
    if (!formData.eventDate) formErrors.eventDate = EventExceptionsEnum.EventDateIsRequired;
    else if (formData.eventDate < new Date()) formErrors.eventDate = EventExceptionsEnum.EventDateFutureDate;
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const requestBody = {
      title: formData.title,
      address: formData.address,
      cityId: formData.selectedCity?.id,
      categoryIds: formData.selectedCategories.map((category) => category.id),
      eventDate: formData.eventDate,
      description: formData.description
    };

    const cleanedRequestBody = cleanObject(requestBody);

    try {
      const response = await fetch(EventsRoutes.Create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedRequestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.message || EventExceptionsEnum.UnexpectedEventError);
      } else {
        alert(EventMessagesEnum.EventCreated);
        setServerError(null);
      }
    } catch (error) {
      setServerError(CommonExceptionsEnum.UnexpectedError);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>, key: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: event.target.value }));
  };

  const handleDateChange = (newValue: Date | null) => {
    setFormData((prevData) => ({ ...prevData, eventDate: newValue }));
  };

  return (
    <Box>
      <AppNavbar tabValue={1} />

      <Box p={4} maxWidth={600} mx="auto" mt={4}>
        <Typography variant="h4" mb={3} textAlign="center" color="#1976d2">
          Create New Event
        </Typography>

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.address}
          helperText={errors.address}
        />

        <Grid container spacing={2} marginY={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Event Date"
                value={formData.eventDate}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
            {errors.eventDate && <Typography color="error">{errors.eventDate}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                value={formData.selectedCity}
                onChange={(e) => handleSelectChange(e, 'selectedCity')}
                label="City"
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.selectedCity && <Typography color="error">{errors.selectedCity}</Typography>}
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="categories-label">Categories</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={formData.selectedCategories}
            onChange={(e) => handleSelectChange(e, 'selectedCategories')}
            renderValue={(selected) => selected.map((el) => el.name).join(", ")}
            label="Categories"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.selectedCategories && <Typography color="error">{errors.selectedCategories}</Typography>}
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />

        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
          Create Event
        </Button>

        {serverError && <Typography color="error" textAlign="center" mt={2}>{serverError}</Typography>}
      </Box>
    </Box>
  );
};

export default CreateEventPage;
