const answers = {
  selectedOffer: "standard",
  recipientName: "Yassine Test E2E",
  recipientType: "ami",
  genre: "pop",
  voiceGender: "male",
  songLanguage: "french",
  beautifulQualities: "test",
  specialMoments: "test",
  specialMessage: "test",
  email: "yassine@test.com",
  phoneCountryCode: "+33",
  phoneNumber: "600000000"
};

async function run() {
  console.log("Sending POST /api/orders...");
  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers)
  });
  
  if (!res.ok) {
    console.error("Failed to create order:", await res.text());
    return;
  }
  
  const { orderId } = await res.json();
  console.log("Created orderId:", orderId);
  
  console.log("Fetching order page at /checkout?orderId=" + orderId + " ...");
  const pageRes = await fetch("http://localhost:3000/checkout?orderId=" + orderId);
  const text = await pageRes.text();
  
  if (text.includes("Commande introuvable")) {
    console.error("❌ ERROR: Page says 'Commande introuvable'!");
  } else if (text.includes("Yassine Test E2E")) {
    console.log("✅ SUCCESS: Found order on checkout page!");
  } else {
    console.log("⚠️ WARNING: Order not found but no 'introuvable' message either. Checking snippet:", text.substring(0, 200));
  }
}

run();
