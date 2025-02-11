type ShouldDebugOptions = {
  tag: string;
  debugSearchParameterName: string;
  allTag: string;
};

/**
 * @description
 * Use this helper to determine if the given tag should be logged as a debug log.
 */
export const shouldDebug = (options: ShouldDebugOptions) => {
  const { tag, debugSearchParameterName, allTag } = options;

  if (!window) {
    return false;
  }

  const serializedSearchParameters = window.location.search ?? '';
  const searchParams = new URLSearchParams(serializedSearchParameters);

  try {
    const target = searchParams.get(debugSearchParameterName);

    if (!target) {
      return false;
    }

    switch (true) {
      case target === allTag: {
        return true;
      }

      case typeof target === 'string': {
        return target.split(',').includes(tag);
      }

      default: {
        return false;
      }
    }
  } catch {
    return false;
  }
};

export type ShouldDebug = typeof shouldDebug;
