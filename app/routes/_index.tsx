import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const headers: HeadersFunction = ({}) => ({
  "Cache-Control": "max-age=86400, must-revalidate",
});

export default function Index() {
  return (
    <div className="h-screen w-full grid place-content-center text-center">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
        Welcome to Weather Reporter
      </h1>
      <p className="leading-7 text-muted-foreground">
        Enter a city name to view the weather in that city
      </p>
      <Form method="get" action="/weather" className="mt-4 space-y-3">
        <Input type="text" name="city" placeholder="City name (e.g. Paris)" />
        <Button type="submit">View Weather</Button>
      </Form>
    </div>
  );
}
