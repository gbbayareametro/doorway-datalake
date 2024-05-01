import { Handler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";

export const handler: Handler = async (event, context) => {
  const prisma = new PrismaClient();

  const listing1 = prisma.listing.create({
    data: {
      address: "123 main st.",
      city: "Chicago",
      state: "IL",
      zip: "60640",
    },
  });

  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  return context.logStreamName;
};
