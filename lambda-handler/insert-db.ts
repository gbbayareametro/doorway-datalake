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

  for (let  i=0;i < 10; i++) {
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
  const listings = await prisma.listing.findMany()
  const count = listings.length
  console.log(listings)
  for (let  i=0;i < 10; i++) {
    const myListing = listings[Math.floor(Math.random()*count)]
    const applicant = prisma.application.create({
      data: {
        demo1: 'abcd',
        demo2: 'defg',
        DOB: new Date('1967-2-4'),
        listingId: myListing.id


      }
    })
    console.log(applicant)

  }



}
async function getListings(prisma: PrismaClient) {

}