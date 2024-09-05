"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { EventInerface } from "@/interfaces/event/event.interface";
import { useParams, useRouter } from "next/navigation";
import AppNavbar from "@/components/AppBar";
import { formatDate } from "@/utils/common/format-date";
import { CommonExceptionsEnum } from "@/enums/exception/common-exceptions.enum";
import { EventsRoutes } from "@/enums/routes/events-routes.enum";
import { EventExceptionsEnum } from "@/enums/exception/event-exceptions.enum";

interface EventDetailsPageProps {
  event: EventInerface;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = () => {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventInerface | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<EventInerface[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        try {
          const response = await fetch(`${EventsRoutes.GetById}${id}`);
          const data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error("Failed to fetch event details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchRecommendedEvents = async () => {
      if (id) {
        try {
          const response = await fetch(`${EventsRoutes.GetRecomended}${id}`);
          const data = await response.json();
          setRecommendedEvents(data);
        } catch (error) {
          console.error(EventExceptionsEnum.FailedToFetchEvent, error);
        } finally {
          setLoadingRecommended(false);
        }
      }
    };

    fetchEvent();
    fetchRecommendedEvents();
  }, [id]);

  const handleNavigate = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  if (loading) return <div>Loading...</div>;

  if (!event) return <div>Event not found</div>;

  return (
    <>
      <AppNavbar tabValue={0} />

      <Box p={4} maxWidth={800} mx="auto" mt={4}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" mb={3} textAlign="center" color="#1976d2">
              Event Details
            </Typography>

            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Title: {event.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Description: {event.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              City: {event.city.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Categories: {event.categories.map((cat) => cat.name).join(", ")}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Address: {event.address}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Event Date: {formatDate(event.eventDate)}
            </Typography>
          </CardContent>
        </Card>

        <Box mt={4}>
          <Typography variant="h5" mb={2} textAlign="center">
            Recommended Events
          </Typography>
          {loadingRecommended ? (
            <div>Loading recommended events...</div>
          ) : (
            <Grid container spacing={2}>
              {recommendedEvents.map((recEvent) => (
                <Grid item xs={12} sm={4} key={recEvent.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3, cursor: "pointer" }} onClick={() => handleNavigate(recEvent.id)}>
                    <CardContent>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {`${recEvent.title.substring(0, 15)} ${recEvent.title.length > 15 ? ".." : ""}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {`${recEvent.address.substring(0, 15)} ${recEvent.address.length > 15 ? ".." : ""}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formatDate(recEvent.eventDate)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EventDetailsPage;
