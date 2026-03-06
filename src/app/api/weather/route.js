export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Tashkent';
  const days = searchParams.get('days') || '2';

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=b4c1c42e939d40cc9a9170518242412&q=${location}&days=${days}&aqi=no&alerts=no`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data' }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch weather data', details: error.message }),
      { status: 500 }
    );
  }
}
