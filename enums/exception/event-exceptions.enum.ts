export enum EventExceptionsEnum {
  TitleToShort = "Title must be at least 3 characters",
  AddressToShort = "Address must be at least 3 characters",
  CityIsRequired = "City is required",
  CategoryMinLength = "At least 2 categories must be selected",
  EventDateIsRequired = "Event date is required",
  EventDateFutureDate = "Event date cannot be in the past",
  UnexpectedEventError = "An error occurred while creating the event.",
  UpdateError = "An error occurred while updating the event.",
  FailedToFetchEvent = "Failed to fetch recommended events:",
}
