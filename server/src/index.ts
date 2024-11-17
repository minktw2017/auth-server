import { Elysia } from "elysia";

const app = new Elysia()
  .get("/watchdog", () => "I am running")
  .get("/", () => "Hello Elysia, I am running").listen(process.env.PORT);
  

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
