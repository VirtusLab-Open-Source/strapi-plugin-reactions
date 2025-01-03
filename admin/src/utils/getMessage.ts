import { useIntl } from "react-intl";
import { pluginId } from "../pluginId";

type MessageInput = string | MessageInputObject;

type MessageInputObject = {
  id: string;
  props?: {
    [key: string]: any;
  };
};

const getMessage = (
  input: MessageInput,
  defaultMessage = "",
  inPluginScope = true,
) => {
  const { formatMessage } = useIntl();
  let formattedId = "";
  if (typeof input === 'string') {
    formattedId = input;
  } else {
    formattedId = input?.id.toString() || formattedId;
  }
  return formatMessage(
    {
      id: `${inPluginScope ? pluginId : "app.components"}.${formattedId}`,
      defaultMessage,
    },
    typeof input === 'string' ? undefined : input?.props,
  ) as string;
};

export default getMessage;
