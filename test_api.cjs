fetch('https://toolspro-three.vercel.app/api/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 35000, currency: "INR" })
}).then(async res => {
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}).catch(console.error);
