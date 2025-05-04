import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/panelofficial.biz.id')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <h1>Info Cloudflare</h1>
      <ul>
        <li><strong>API Key:</strong> {data.apiKey}</li>
        <li><strong>Zone ID:</strong> {data.zoneId}</li>
        <li><strong>Domain:</strong> {data.domain}</li>
      </ul>
    </div>
  );
}
