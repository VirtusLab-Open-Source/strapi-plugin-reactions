const routes = [
  {
    method: 'GET',
    path: '/settings/config',
    handler: 'settingsController.fetch',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/settings/config',
    handler: 'settingsController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings/config',
    handler: 'settingsController.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/settings/config/reaction-type/:id',
    handler: 'settingsController.deleteReactionType',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/zone/count/:uid',
    handler: 'zoneController.count',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/zone/count/:uid/:id',
    handler: 'zoneController.count',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/utils/slug',
    handler: 'settingsController.generateSlug',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/utils/syncAssociations',
    handler: 'settingsController.syncAssociations',
    config: {
      policies: [],
    },
  },

];

export default routes;
