import { Input } from '../../../commands';
import { Configuration } from '../../configuration/configuration';

export function getValueOrDefault<T = any>(
  configuration: Required<Configuration>,
  propertyPath: string,
  appName: string
): T {
  const value = getValueOfPath(configuration, propertyPath);
  return value;
}

function getValueOfPath<T = any>(
  object: Record<string, any>,
  propertyPath: string,
): T {
  const fragments = propertyPath.split('.');

  let propertyValue = object;
  for (const fragment of fragments) {
    if (!propertyValue) {
      break;
    }
    propertyValue = propertyValue[fragment];
  }
  return propertyValue as T;
}
