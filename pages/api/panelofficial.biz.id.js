export default function handler(req, res) {
  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Kirim JSON dengan kredensial dari environment variables
  res.status(200).json({
    apiKey: process.env.CF_API_KEY,
    zoneId: process.env.CF_ZONE_ID,
    domain: 'panelofficial.biz.id'
  });
}
