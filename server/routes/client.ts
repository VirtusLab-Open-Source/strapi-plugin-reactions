import { StrapiRoute } from "strapi-typed";

const routes: StrapiRoute[] = [
  {
    method: 'GET',
    path: '/kinds',
    handler: 'clientController.kinds',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/list/:uid/:id',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/list/:kind/:uid/:id',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/set/:kind/:uid/:id',
    handler: 'clientController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/unset/:kind/:uid/:id',
    handler: 'clientController.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/toggle/:kind/:uid/:id',
    handler: 'clientController.toggle',
    config: {
      policies: [],
    },
  },
];

export default routes;
