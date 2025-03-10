import z from "zod";
import { WebAPIUser } from "./WebAPIUser";

export const WebAPIUsersResponse = z.object({
  users: z.array(WebAPIUser),
});
