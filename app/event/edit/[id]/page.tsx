"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CityInterface } from "@/interfaces/city/city.interface";
import { CategoryInterface } from "@/interfaces/category/category.interface";
import { EventInerface } from "@/interfaces/event/event.interface";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AppNavbar from "@/components/AppBar";
import { EventsRoutes } from "@/enums/routes/events-routes.enum";
import { cleanObject } from "@/utils/common/clean-object";
import { CommonExceptionsEnum } from "@/enums/exception/common-exceptions.enum";
import { EventMessagesEnum } from "@/enums/success-messages/event-messages.enum";
import { EventExceptionsEnum } from "@/enums/exception/event-exceptions.enum";
import { CityRoutes } from "@/enums/routes/city-routes.enum";
import { CategoryRoutes } from "@/enums/routes/categories-routes.enum";

const EditEventPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventInerface | null>(null);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityInterface | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [cities, setCities] = useState<CityInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`${EventsRoutes.GetById}${id}`);
          const data = await response.json();
          setEvent(data);
          setTitle(data.title);
          setAddress(data.address);
          setSelectedCity(data.city);
          setSelectedCategories(data.categories);
          setEventDate(new Date(data.eventDate));
          setDescription(data.description);
        } catch (error) {
          console.error("Failed to fetch event details:", error);
        }
      };

      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch("http://localhost:4001/api/cities/list");
      const data = await response.json();
      setCities(data);
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:4001/api/categories/list");
      const data = await response.json();
      setCategories(data);
    };

    fetchCities();
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const requestBody = {
      title,
      address,
      cityId: selectedCity?.id,
      categoryIds: selectedCategories.map((category) => category.id),
      eventDate,
      description
    };

    const cleanedRequestBody = cleanObject(requestBody);

    try {
      const response = await fetch(`${EventsRoutes.Update}${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedRequestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || EventExceptionsEnum.UpdateError);
      } else {
        alert(EventMessagesEnum.EventUpdated);
        router.push(`/event/${id}`);
      }
    } catch (error) {
      console.error(CommonExceptionsEnum.UnexpectedError, error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <Box>
      <AppNavbar tabValue={1} />

      <Box p={4} maxWidth={600} mx="auto" mt={4}>
        <Typography variant="h4" mb={3} textAlign="center">
          Edit Event
        </Typography>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          margin="normal"
        />

        <Grid container spacing={2} marginY={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Event Date"
                value={eventDate}
                onChange={(newValue) => setEventDate(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                value={selectedCity ? selectedCity.id : ""}
                onChange={(e) => {
                  const city = cities.find(city => city.id === e.target.value);
                  setSelectedCity(city || null);
                }}
                label="City"
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="categories-label">Categories</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={selectedCategories.map((category) => category.id)}
            onChange={(e) => {
              const selectedIds = e.target.value as string[];
              const selectedCategories = categories.filter(category => selectedIds.includes(category.id));
              setSelectedCategories(selectedCategories);
            }}
            renderValue={(selected) => selected.map((id) => categories.find(cat => cat.id === id)?.name).join(", ")}
            label="Categories"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />

        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditEventPage;
