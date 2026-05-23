import mongoose from "mongoose";
import { createClerkClient } from "@clerk/backend";
import { FaceUser } from "../model/FaceUser.js";
import dotenv from "dotenv";

dotenv.config();

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

await mongoose.connect(`${process.env.MONGOOSE}/miniFacebook`);

const syncUsers = async () => {
    try {

        const { data: users } =
            await clerkClient.users.getUserList();

        for (const user of users) {

            const exists =
                await FaceUser.findById(user.id);

            if (exists) continue;

            let username =
                user.emailAddresses[0]
                    .emailAddress
                    .split("@")[0];

            await FaceUser.create({
                _id: user.id,
                email: user.emailAddresses[0].emailAddress,
                full_name:
                    `${user.firstName || ""} ${user.lastName || ""}`,
                profile_picture: user.imageUrl,
                username
            });

            console.log("created:", user.id);
        }

        console.log("Done");
        process.exit();

    } catch (err) {
        console.log(err);
    }
};

syncUsers();