import { Handler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";

export const handler: Handler = async (event, context) => {
  const prisma = new PrismaClient();
  await listingInsert(prisma)
  console.log("I GOT HERE!!!!!!")
  await getListings(prisma)
  return context.logStreamName;
};
async function listingInsert(prisma: PrismaClient) {


  const listing1 = await prisma.listing.create({
    data: {
      address: "123 main st.",
      city: "Chicago",
      state: "IL",
      zip: "60640",
    },
  });
  console.log(listing1)

}
async function getListings(prisma: PrismaClient) {
  const listings = await prisma.listing.findMany()
  console.log(listings)

}