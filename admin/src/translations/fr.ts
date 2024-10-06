const fr = {
  plugin: {
    name: "Réactions",
    section: {
      name: "Plugin de réactions",
      item: "Configuration",
    },
  },
  page: {
    settings: {
      header: {
        title: "Réactions",
        description: "Gérer les types de réactions",
      },
      action: {
        create: "Ajouter une nouvelle réaction",
        syncAssociations: {
          title: "Synchronisation des associations",
          description: "Effectuer la synchronisation des associations de réactions pour mettre à jour les clés de recherche",
          tip: "Nous recommandons de le faire après avoir importé/exporté un ensemble de données pouvant affecter la cartographie des relations",
          button: "Synchroniser maintenant",
        },
      },
      section: {
        administrationTools: {
          title: "Outils d'administration",
          subtitle: "Outils et actions à des fins spéciales que vous pouvez effectuer dans le contexte global du plugin",
        },
      },
      table: {
        action: {
          add: "Ajouter une autre réaction",
          edit: "Modifier",
          delete: "Supprimer",
        },
        headers: {
          icon: "Icône",
          name: "Nom",
          slug: "Identifiant",
          usedIn: "Utilisé dans",
          actions: "Actions",
        },
      },
      modal: {
        title: {
          create: "Créer une réaction",
          update: "Mettre à jour la réaction",
          delete: "Confirmation",
          syncAssociations: "Confirmer la synchronisation",
        },
        description: {
          delete: "Voulez-vous vraiment supprimer le type de réaction \"{ name }\" et toutes les données corrélées?",
          syncAssociations: "Voulez-vous vraiment effectuer la synchronisation des associations dans toutes les Réactions?",
        },
        action: {
          submit: "Soumettre",
          cancel: "Annuler",
          delete: {
            cancel: "Annuler",
            submit: "Confirmer",
          },
          syncAssociations: {
            cancel: "Annuler",
            submit: "Synchroniser",
          },
        },
      },
      form: {
        name: {
          label: "Nom",
          required: "Le nom est requis",
        },
        slug: {
          label: "Identifiant unique",
          hint: "Les réactions peuvent être interrogées par cet identifiant convivial",
          required: "L'identifiant est requis",
        },
        icon: {
          label: "Icône",
          required: "L'icône est requise",
        },
        type: {
          label: "Visualiser comme",
          image: {
            label: "Image",
          },
          emoji: {
            label: "Émoji",
          },
          hint: "Choisissez de visualiser la réaction comme Image ou Émoji",
        },
        emoji: {
          label: "Émoji",
          empty: "Sélectionnez un émoji dans l'ensemble prédéfini",
          button: {
            label: "Sélectionner",
          },
          plugin: {
            search: {
              label: "Rechercher un émoji...",
            },
          },
          required: "L'émoji est requis",
        },
      },
      loading: "Chargement de la configuration...",
      notification: {
        submit: {
          success: "Type de réaction soumis avec succès",
          error: "Quelque chose a mal tourné. Réessayez",
        },
        generateSlug: {
          error: "Impossible de générer un identifiant unique",
        },
        syncAssociations: {
          success: "Associations synchronisées avec succès",
          error: "Impossible de synchroniser les associations. Veuillez réessayer",
        },
        reaction: {
          delete: {
            success: "Type de réaction supprimé avec succès",
            error: "Quelque chose a mal tourné. Réessayez",
          },
        },
      },
    },
    injection: {
      notification: {
        fetch: {
          error: "Quelque chose a mal tourné. Réessayez",
        },
      },
    },
  },
};

export default fr;
