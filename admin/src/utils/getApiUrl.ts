import { pluginId } from "../pluginId";

const getApiURL = (endPoint: string): string => `/${pluginId}/${endPoint}`;

export default getApiURL;
