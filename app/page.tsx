"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TextField, Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, SelectChangeEvent } from "@mui/material";
import EventCard from "@/components/EventCard";
import { CategoryInterface } from "@/interfaces/category/category.interface";
import { CityInterface } from "@/interfaces/city/city.interface";
import { EventInerface } from "@/interfaces/event/event.interface";
import { cleanObject } from "@/utils/common/clean-object";
import { formatDate } from "@/utils/common/format-date";
import PaginationBar from "@/components/PaginationBar";
import debounce from 'lodash/debounce';
import { GetEventsRequestInterface } from "@/interfaces/event/get-events-request.interface";
import AppNavbar from "@/components/AppBar";
import { EventMessagesEnum } from "@/enums/success-messages/event-messages.enum";
import { CommonExceptionsEnum } from "@/enums/exception/common-exceptions.enum";
import { CityRoutes } from "@/enums/routes/city-routes.enum";
import { CategoryRoutes } from "@/enums/routes/categories-routes.enum";
import { EventsRoutes } from "@/enums/routes/events-routes.enum";

const EventPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCities, setSelectedCities] = useState<CityInterface[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
  const [filter, setFilter] = useState("");
  const [cities, setCities] = useState<CityInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [events, setEvents] = useState<EventInerface[]>([]);

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

  const fetchEvents = async (page: number) => {
    const requestBody: GetEventsRequestInterface = {
      pageSize: 5,
      pageNumber: page,
      title: searchTitle,
      cityIds: selectedCities.map((city) => city.id),
      categoryIds: selectedCategories.map((category) => category.id),
      sortBy: filter
    };

    const cleanedRequestBody = cleanObject(requestBody);

    const response = await fetch(EventsRoutes.GetEvents, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedRequestBody),
    });

    const data = await response.json();
    setEvents(data);
  };

  const debouncedFetchEvents = useCallback(
    debounce((page: number) => fetchEvents(page), 500),
    [searchTitle, selectedCities, selectedCategories, filter]
  );

  useEffect(() => {
    debouncedFetchEvents(currentPage);
    return debouncedFetchEvents.cancel;
  }, [currentPage, debouncedFetchEvents]);


  const handleCityChange = (event: SelectChangeEvent<CityInterface[]>) => {
    setSelectedCities(event.target.value as CityInterface[]);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${EventsRoutes.Delete}${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(EventMessagesEnum.EventDeleted);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "An error occurred"}`);
      }
    } catch (error) {
      alert(CommonExceptionsEnum.UnexpectedError);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<CategoryInterface[]>) => {
    setSelectedCategories(event.target.value as CategoryInterface[]);
  };

  return (
    <Box>
      <AppNavbar tabValue={0}/>
      <Box p={2} maxWidth={1000} mx="auto" mt={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="cities-label">Cities</InputLabel>
              <Select
                labelId="cities-label"
                multiple
                value={selectedCities}
                onChange={handleCityChange}
                renderValue={(selected) => {
                  return selected.map((el) => el.name).join(", ");
                }}
                label="Cities"
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) => {
                  return selected.map((el) => el.name).join(", ");
                }}
                label="Categories"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-label">Filter by</InputLabel>
              <Select
                labelId="filter-label"
                value={filter}
                onChange={(e) => setFilter(e.target.value as string)}
                label="Filter by"
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="description">Description</MenuItem>
                <MenuItem value="eventDate">Event Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        {events.length === 0 ? (
          <Typography>No events found</Typography>
        ) : (
          events.map((event) => (
            <EventCard
              id={event.id}
              key={event.id}
              title={event.title}
              description={event.description}
              city={event.city?.name ?? "Hiden"}
              categories={event.categories.map((cat) => cat.name)}
              date={formatDate(event.eventDate)}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>

      <PaginationBar currentPage={currentPage} prevPage={handlePreviousPage} nextPage={handleNextPage}/>
      
    </Box>
  );
};

export default EventPage;
