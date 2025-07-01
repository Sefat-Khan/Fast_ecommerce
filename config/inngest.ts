import User from "@/models/user";
import { Inngest } from "inngest";
import { connectDB } from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fastcart-next" });

// Inngest Functions to save user data

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const useData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      image: image_url || "",
    };
    // Save user data to your database
    await connectDB();
    await User.create(useData);
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
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const useData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      image: image_url || "",
    };
    // Save updated user data to your database
    await connectDB();
    await User.findByIdAndUpdate(id, useData);
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
  async ({ event }) => {
    const { id } = event.data;
    // Save updated user data to your database
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
