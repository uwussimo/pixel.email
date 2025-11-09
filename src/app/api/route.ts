export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // send telegram message
  const sendTo = 701469970; // your telegram id
  const token = process.env.TELEGRAM_TOKEN;

  const ipAddress = request.headers.get('x-real-ip');
  const url = `http://ip-api.com/json/${ipAddress}`;

  const address = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await address.json();

  const location = `*${data.city}, ${data.regionName}, ${data.country}* \n\n*ISP:* ${data.isp}\n\n*ZIP:* ${data.zip}`;
  const message = `Email *${id}* has been read by \n\n${request.headers.get(
    'user-agent'
  )},\n\n*IP:* ${request.headers.get('x-real-ip')}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: sendTo,
      text: message,
      parse_mode: 'Markdown',
    }),
  });

  await fetch(`https://api.telegram.org/bot${token}/sendLocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: sendTo,
      latitude: data.lat,
      longitude: data.lon,
    }),
  });

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: sendTo,
      text: location,
      parse_mode: 'Markdown',
    }),
  });

  //return image
  const image_url =
    'https://upload.wikimedia.org/wikipedia/en/1/1c/Whitworth_University_%28logo%29.svg';

  const response = await fetch(image_url);
  return new Response(response.body, {
    headers: { 'Content-Type': 'image/png' },
  });
}
