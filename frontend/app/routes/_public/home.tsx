import { HomeScreen } from "~/pages/public/Home";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Concord" },
    { name: "description", content: "A new version of the Concord app!" },
  ];
}

export default function Home() {
  return <HomeScreen />;
}
