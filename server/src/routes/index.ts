import clientRoutes from "./client";
import adminRoutes from "./admin";

type Routes = typeof clientRoutes | typeof adminRoutes;

type PluginRoutes = {
  [key: string]: PluginScopeRoutes;
};

type PluginScopeRoutes = {
  type: string;
  routes: Routes;
};

const routes: PluginRoutes = {
  "content-api": {
    type: "content-api",
    routes: clientRoutes,
  },
  admin: {
    type: "admin",
    routes: adminRoutes,
  },
};

export default routes;
