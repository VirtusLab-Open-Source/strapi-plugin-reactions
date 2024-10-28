import { useIntl } from "react-intl";
import { pluginId } from "../pluginId";

const handleAPIError = (
  err: Error | unknown | null = null,
  toggleNotification: any = null,
  message = "app.components.notification.error"
) => {

  const { formatMessage } = useIntl();
  toggleNotification({
    type: "warning",
    message: formatMessage({
      id: `${pluginId}.${message}`,
    }),
  });

  if (err) {
    throw err;
  } else {
    throw new Error("error");
  }
};

export default handleAPIError;
