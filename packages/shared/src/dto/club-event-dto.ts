import { z } from "zod";

const eventTitleValidator = z
  .string()
  .trim()
  .min(1, "Event title is required.")
  .max(150, "Event title must be at most 150 characters.");

const eventDescriptionValidator = z
  .string()
  .trim()
  .min(1, "Event description is required.")
  .max(5000, "Event description must be at most 5000 characters.");

const eventDateValidator = z.coerce.date({
  error: "Event date must be a valid date.",
});

export const CreateClubEventValidator = z.object({
  eventTitle: eventTitleValidator,
  eventDescription: eventDescriptionValidator,
  eventDate: eventDateValidator,
  clubId: z.uuid("Invalid club ID."),
});

export type CreateClubEventDto = z.infer<typeof CreateClubEventValidator>;

export const UpdateClubEventValidator = z.object({
  eventTitle: eventTitleValidator,
  eventDescription: eventDescriptionValidator,
  eventDate: eventDateValidator,
});

export type UpdateClubEventDto = z.infer<typeof UpdateClubEventValidator>;
