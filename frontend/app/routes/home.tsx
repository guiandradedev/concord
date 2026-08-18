import type { Route } from "./+types/home";
import { HomeScreen } from "~/pages/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Concord" },
    { name: "description", content: "A new version of the Concord app!" },
  ];
}

export default function Home() {
  return <HomeScreen />;
}
