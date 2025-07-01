import { Inngest } from "inngest";
import User from "../models/user";
import { connectDB } from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fastcart-next" });

// Inngest Functions to save user data

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, logger }) => {
    // `logger` is provided by Inngest
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        image: image_url || "",
      };

      await connectDB();
      await User.create(userData);
      logger.info(`User ${id} created successfully`);
    } catch (error) {
      logger.error("Failed to create user:", error);
      throw error; // Re-throw to mark the function as failed
    }
  }
);

//Inngest Functions to update user data

export const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event, logger }) => {
    // `logger` is provided by Inngest
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        image: image_url || "",
      };

      await connectDB();
      await User.findByIdAndUpdate(id, userData);
      logger.info(`User ${id} updated successfully`);
    } catch (error) {
      logger.error("Failed to update user:", error);
      throw error; // Re-throw to mark the function as failed
    }
  }
);

//Inngest Functions to delete user data

export const syncUserDelete = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event, logger }) => {
    try {
      const { id } = event.data;
      // Save updated user data to your database
      await connectDB();
      await User.findByIdAndDelete(id);
      logger.info(`User ${id} deleted successfully`);
    } catch (error) {
      logger.error("Failed to delete user:", error);
      throw error; // Re-throw to mark the function as failed
    }
  }
);
