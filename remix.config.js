/** @type {import('@remix-run/dev').AppConfig} */
export const appDirectory = "app";
export const assetsBuildDirectory = "public/build";
export const future = {
  /* any enabled future flags */
};
export const ignoredRouteFiles = ["**/*.css"];
export const publicPath = "/build/";
export function routes(defineRoutes)
{
  return defineRoutes((route) =>
  {
    route("api/user", "routes/api/user.ts");
  });
}
export const serverBuildPath = "build/index.js";
  