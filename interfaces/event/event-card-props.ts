export interface EventCardProps {
  id: string;
  title: string;
  description: string;
  city: string;
  categories: string[];
  date: string;
  onDelete: (id: string) => void;
}
