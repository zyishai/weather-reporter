import {
  HeadersFunction,
  LoaderArgs,
  Response,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import { Map, Marker } from "pigeon-maps";
import { stamenTerrain } from "pigeon-maps/providers";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import config from "~/lib/config";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=30, s-maxage=120, stale-while-revalidate=600",
});

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const latlng = searchParams.get("latlng");
  const city = searchParams.get("city");

  if (!latlng && !city) {
    return redirect("/");
  }

  const response = await fetch(
    `${config.apiEndpoint}/current.json?key=${config.apiKey}&q=${
      latlng || city
    }`
  );
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return json({ ...data });
  } else {
    throw new Response("Failed to fetch current weather");
  }
};

export default function WeatherPage() {
  const weatherData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="container h-screen flex flex-col py-8">
      <header className="flex items-center justify-between">
        <div className="font-medium">
          <p className="text-sm text-muted-foreground">Weather Result</p>
          <span>
            {weatherData.location.name}, {weatherData.location.country}
          </span>
        </div>
        <Link
          to="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          New Search
        </Link>
      </header>
      <Separator className="my-4" />
      <section className="grid lg:grid-cols-4 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="text-3xl">
                {weatherData.current.condition.text}
              </div>
              <img
                src={weatherData.current.condition.icon}
                alt="current weather icon"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="text-3xl">
                {weatherData.current.temp_c}&deg;C ({weatherData.current.temp_f}
                &deg;F)
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="text-3xl">{weatherData.current.humidity}%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wind Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="text-3xl">
                {weatherData.current.wind_kph} km/h (
                {weatherData.current.wind_mph} mph)
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="flex-1 min-h-[300px] mt-4">
        <ClientOnly fallback={<div className="bg-secondary" />}>
          {() => (
            <Map
              provider={stamenTerrain}
              defaultCenter={[
                weatherData.location.lat,
                weatherData.location.lon,
              ]}
              defaultZoom={11}
              onClick={({ latLng }) => {
                navigate(`/weather?latlng=${latLng.toString()}`);
              }}
            >
              <Marker
                width={50}
                anchor={[
                  weatherData.location.lat + 0.0015,
                  weatherData.location.lon,
                ]}
                color="red"
              />
            </Map>
          )}
        </ClientOnly>
      </section>
    </div>
  );
}
