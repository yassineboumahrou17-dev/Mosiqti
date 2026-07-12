import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) {
    let val = match[2];
    if (val.includes('\\n')) val = val.replace(/\\n/g, '\n');
    process.env[match[1]] = val;
  }
});

import { appendOrderToSheet } from './lib/googleSheets';
import { Order } from './lib/orders';

async function test() {
  const dummyOrder: Order = {
    id: 'test_123',
    answers: {
      recipientName: "Yassine Test",
      email: "test@example.com",
      selectedOffer: "standard",
    } as any,
    status: 'pending',
    amount: 190,
    createdAt: new Date().toISOString()
  };
  
  console.log('Testing sheet append...');
  const res = await appendOrderToSheet(dummyOrder);
  console.log('Result:', res);
}

test();
