const routes = [
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
    path: '/list/single/:uid',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/list/collection/:uid/:id',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/list/:kind/single/:uid',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/list/:kind/collection/:uid/:id',
    handler: 'clientController.list',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/set/:kind/single/:uid',
    handler: 'clientController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/set/:kind/collection/:uid/:id',
    handler: 'clientController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/unset/:kind/single/:uid',
    handler: 'clientController.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/unset/:kind/collection/:uid/:id',
    handler: 'clientController.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/toggle/:kind/single/:uid',
    handler: 'clientController.toggle',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/toggle/:kind/collection/:uid/:id',
    handler: 'clientController.toggle',
    config: {
      policies: [],
    },
  },
];

export default routes;
