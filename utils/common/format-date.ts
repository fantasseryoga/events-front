export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const formattedTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  return `${formattedDate} ${formattedTime}`;
};