import { Context, MemorySessionStorage, MiddlewareFn, SessionOptions } from 'grammy';

export const namedSession = <K extends string, S, C extends Context>(name: K, options: SessionOptions<S> = {}): MiddlewareFn<C & Record<K, S>> => {
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
    let value: S | undefined;

    if (key !== undefined) {
      value = (await storage.read(key)) ?? options.initial?.();
    }

    Object.defineProperty(ctx, name, {
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
