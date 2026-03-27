import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export function purnEmptyProperties<T extends object>(
  data: T,
): {
  [K in keyof T]?: NonNullable<T[K]>;
} {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => !!value)) as {
    [K in keyof T]?: NonNullable<T[K]>;
  };
}

export function formDirtyComfirmation(): boolean {
  return confirm(
    `Do you really want to leave?
Your changes will be discarded.`,
  );
}

declare const navigation:
  | {
      readonly canGoBack: boolean;
      readonly canGoForward: boolean;
      back(): Promise<unknown>;
      forward(): Promise<unknown>;
    }
  | undefined;

export function createNavigateBack(defaultPaths?: readonly unknown[]): () => Promise<void> {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  if (typeof navigation !== 'undefined') {
    return async () => {
      if (navigation.canGoBack) {
        return void (await navigation.back());
      } else {
        return void (await router.navigate(defaultPaths ?? ['..'], {
          replaceUrl: true,
          relativeTo: route,
        }));
      }
    };
  } else {
    return async () => {
      return void history.back();
    };
  }
}
