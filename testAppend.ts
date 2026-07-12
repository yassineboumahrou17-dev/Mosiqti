import { createOrder, getOrderById } from "./lib/orders";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  console.log("Creating order...");
  const order = await createOrder({
    selectedOffer: "standard",
    recipientName: "Test User",
    recipientType: "other",
    genre: "pop",
    customGenre: "",
    voiceGender: "male",
    songLanguage: "french",
    beautifulQualities: "nice",
    specialMoments: "met in 2020",
    specialMessage: "hello",
    email: "test@example.com",
    phoneNumber: "123456789",
    phoneCountryCode: "+33"
  } as any);

  console.log("Created order ID:", order.id);

  console.log("Fetching order...");
  const fetched = await getOrderById(order.id);
  
  if (fetched) {
    console.log("SUCCESS! Found:", fetched.id);
  } else {
    console.log("ERROR! Order not found.");
  }
}

run().catch(console.error);
