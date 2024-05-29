import { pluginId } from '../pluginId';

const getTrad = (id: string): string => `${pluginId}.${id}`;

export default getTrad;
