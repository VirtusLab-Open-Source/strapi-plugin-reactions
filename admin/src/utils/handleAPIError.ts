import { pluginId } from "../pluginId";

const handleAPIError = (
  err: Error | unknown | null = null,
  toggleNotification: any = null,
  message = "app.components.notification.error"
) => {
  toggleNotification({
    type: "warning",
    message: `${pluginId}.${message}`,
  });

  if (err) {
    throw err;
  } else {
    throw new Error("error");
  }
};

export default handleAPIError;
