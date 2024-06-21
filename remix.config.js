/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    appDirectory: "app",
    assetsBuildDirectory: "public/build",
    future: {
      /* any enabled future flags */
    },
    ignoredRouteFiles: ["**/*.css"],
    publicPath: "/build/",
    routes(defineRoutes) {
      return defineRoutes((route) => {
        route("api/user", "routes/api/user.ts");
      });
    },
    serverBuildPath: "build/index.js",
  };
  