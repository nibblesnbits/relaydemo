import type { EntryPointComponent, JSResourceReference } from 'react-relay';
import type { OperationType } from 'relay-runtime';

const map = new Map<string, any>();

export default function JSResource<
  TPreloadedQueries extends Record<string, OperationType>,
  TNestedEntryPoints extends {},
  TRuntimeProps extends {},
  TExtraProps extends {} | null
>(
  id: string,
  loadFunc: () => EntryPointComponent<
    TPreloadedQueries,
    TNestedEntryPoints,
    TRuntimeProps,
    TExtraProps
  >
): JSResourceReference<
  EntryPointComponent<
    TPreloadedQueries,
    TNestedEntryPoints,
    TRuntimeProps,
    TExtraProps
  >
> {
  const createModule = (
    modId: string,
    func: () => EntryPointComponent<
      TPreloadedQueries,
      TNestedEntryPoints,
      TRuntimeProps,
      TExtraProps
    >
  ) => {
    return {
      getModuleId: () => modId,
      getModuleIfRequired: func,
      load: () => Promise.resolve(func()),
    };
  };

  if (map.has(id)) {
    return map.get(id);
  }
  map.set(id, createModule(id, loadFunc));
  return map.get(id);
}
