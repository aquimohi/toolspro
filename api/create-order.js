import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, currency } = req.body;

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_TV5kXAJRxBvunA',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'Rr418J91sGJFAB29mYOxhIyQ',
    });

    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    
    if (!order) return res.status(500).send('Some error occurred');
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
