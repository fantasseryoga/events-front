import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EventCardProps } from "@/interfaces/event/event-card-props";
import { useRouter } from "next/navigation";

const EventCard: React.FC<EventCardProps> = ({ id, title, description, city, categories, date, onDelete }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/event/${id}`);
  };

  const handleEdit = () => {
    router.push(`/event/edit/${id}`);
  };

  return (
    <Card sx={{ maxWidth: 800, width: '100%', m: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={handleNavigate}
            >
              {title.length > 50 ? `${title.slice(0, 50)}...` : title}
            </Typography>
            <Box>
              <IconButton
                edge="end"
                color="primary"
                aria-label="edit"
                onClick={handleEdit}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                aria-label="delete"
                onClick={() => onDelete(id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Typography variant="subtitle2" color="text.secondary">
              City: {city}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Categories: {categories.join(", ")}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Date: {date}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
