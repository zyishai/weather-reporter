const apiKey = process.env.WEATHER_API_KEY;
if (!apiKey) {
  throw new Error('WEATHER_API_KEY missing!');
}

const apiEndpoint = process.env.WEATHER_API_ENDPOINT;
if (!apiEndpoint) {
  throw new Error('WEATHER_API_ENDPOINT missing!');
}

export default {
  apiKey,
  apiEndpoint
}
