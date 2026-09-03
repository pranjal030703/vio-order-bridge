export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST method' });
  }

  const { order_number } = req.body || {};

  if (!order_number) {
    return res.status(400).json({ error: 'order_number is required' });
  }

  const cleanOrderNumber = String(order_number)
    .replace(/^(order|id|#|\s)+/gi, '')
    .trim();

  const apiKey = 'rr_live_sBqHDkWRdmgpbBq-9pKk2w_Qc5jcXQAWTjgoN-tbZn4';
  const targetUrl = `https://track-my-love-order-racketrush.lovable.app/api/public/orders?order_number=${encodeURIComponent(cleanOrderNumber)}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    const data = await upstreamRes.json();
    return res.status(upstreamRes.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
}
