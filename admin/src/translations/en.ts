const en = {
  plugin: {
    name: "Reactions",
    section: {
      name: "Reactions plugin",
      item: "Configuration",
    },
  },
  page: {
    settings: {
      header: {
        title: "Reactions",
        description: "Manage types of reactions",
      },
      action : {
        create: "Add new reaction",
        syncAssociations: {
          title: "Associations synchronization",
          description: "Perform synchronization of reactions associations to make the search keys be up-to-date",
          tip: "We recommend to do this after you import / export a set of a data what might affect relations mapping",
          button: "Synchronize now",
        },
      },
      section: {
        administrationTools: {
          title: "Administration tools",
          subtitle: "Special purpose tools and actions which you can perform in the global plugin context",
        },
      },
      table: {
        action: {
          add: "Add another reaction",
          edit: "Edit",
          delete: "Delete",
        },
        headers: {
          icon: "Icon",
          name: "Name",
          slug: "Slug",
          usedIn: "Used in",
          actions: "Actions",
        },
      },
      modal: {
        title: {
          create: "Create reaction",
          update: "Update reaction",
          delete: "Confirmation",
          syncAssociations: "Confirm synchronization",
        },
        description: {
          delete: "Do you really want to delete \"{ name }\" reaction type and all correlated data?",
          syncAssociations: "Do you really want to perform synchronization of associations across all Reactions?",
        },
        action: {
          submit: "Submit",
          cancel: "Cancel",
          delete: {
            cancel: "Cancel",
            submit: "Confirm",
          },
          syncAssociations: {
            cancel: "Cancel",
            submit: "Synchronize",
          },
        },
      },
      form: {
        name: {
          label: "Name",
          required: "Name is required",
        },
        slug: {
          label: "Unique identifier",
          hint: "Reactions can be queried by this human friendly identifier",
          required: "Slug is required",
        },
        icon: {
          label: "Icon",
          required: "Icon is required",
        },
        type: {
          label: "Visualise as",
          image: {
            label: "Image",
          },
          emoji: {
            label: "Emoji",
          },
          hint: "Choose to to visualise reaction as Image or Emoji",
        },
        emoji: {
          label: "Emoji",
          empty: "Select emoji from predefined set",
          button: {
            label: "Select",
          },
          plugin: {
            search: {
              label: "Search for emoji...",
            },
          },
          required: "Emoji is required",
        },
      },
      loading: "Loading configuration...",
      notification: {
        submit: {
          success: "Reaction type submitted successfully",
          error: "Something went wrong. Try again",
        },
        generateSlug: {
          error: "Cant't generate a unique slug",
        },
        syncAssociations: {
          success: "Associations synchronized successfully",
          error: "Cant't synchronize associations. Please try again",
        },
        reaction: {
          delete: {
            success: "Reaction type removed successfully",
            error: "Something went wrong. Try again",
          },
        },
      },
    },
    injection: {
      notification: {
        fetch: {
          error: "Something went wrong. Try again",
        },
      },
    },
  },
};

export default en;

export type EN = typeof en;
