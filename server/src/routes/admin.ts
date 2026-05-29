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
    path: '/settings/config/reaction-type',
    handler: 'settingsController.createReactionType',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings/config/reaction-type',
    handler: 'settingsController.updateReactionType',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings/config',
    handler: 'settingsController.updateConfig',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/settings/config/reaction-type/:documentId',
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
    path: '/zone/count/:uid/:documentId',
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
