import { Context, MemorySessionStorage, MiddlewareFn, StorageAdapter } from 'grammy';

type MaybePromise<T> = Promise<T> | T;

interface NamedSessionOptions<C extends Context, K extends keyof C> {
  name: K
  initial?: () => C[K]
  getSessionKey?: (ctx: C) => MaybePromise<string | undefined>
  storage?: StorageAdapter<C[K]>
}

export const namedSession = <C extends Context, K extends keyof C>(options: NamedSessionOptions<C, K>): MiddlewareFn<C> => {
  const getSessionKey = options.getSessionKey ?? ((ctx) => ctx.chat?.id.toString());
  const storage = options.storage ?? new MemorySessionStorage();

  const assertNonUndefinedKey = (key: string | undefined, operation: 'access' | 'assign') => {
    if (key === undefined) {
      const reason = options.getSessionKey
        ? 'the custom `getSessionKey` function returned undefined for this update'
        : 'this update does not belong to a chat, so the session key is undefined';
      throw new Error(`Cannot ${operation} session data because ${reason}!`);
    }
  };

  return async (ctx, next) => {
    const key = await getSessionKey(ctx);
    let value = key === undefined ? undefined : (await storage.read(key)) ?? options.initial?.();

    Object.defineProperty(ctx, options.name, {
      enumerable: true,
      get() {
        assertNonUndefinedKey(key, 'access');
        return value;
      },
      set(newValue) {
        assertNonUndefinedKey(key, 'assign');
        value = newValue;
      },
    });

    await next();

    if (key !== undefined) {
      if (value == null) {
        await storage.delete(key);
      } else {
        await storage.write(key, value);
      }
    }
  };
};
