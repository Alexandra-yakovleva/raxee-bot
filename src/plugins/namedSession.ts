import { Context, MemorySessionStorage, MiddlewareFn, StorageAdapter } from 'grammy';

type MaybePromise<T> = Promise<T> | T;

interface NamedSessionOptions<C extends Context, K extends keyof C> {
  name: K
  initial: (ctx: C) => C[K]
  getSessionKey?: (ctx: C) => MaybePromise<string | undefined>
  getStorage?: (ctx: C) => StorageAdapter<C[K]>
  storage?: StorageAdapter<C[K]>
}

export const namedSession = <C extends Context, K extends keyof C>(options: NamedSessionOptions<C, K>): MiddlewareFn<C> => {
  const getSessionKey = options.getSessionKey ?? ((ctx) => ctx.chat?.id.toString());
  const getStorage = (options.getStorage ?? (() => options.storage ?? new MemorySessionStorage()));

  return async (ctx, next) => {
    const key = await getSessionKey(ctx);

    if (key === undefined) {
      const reason = options.getSessionKey
        ? 'the custom `getSessionKey` function returned undefined for this update'
        : 'this update does not belong to a chat, so the session key is undefined';

      Object.defineProperty(ctx, options.name, {
        enumerable: true,
        get() {
          throw new Error(`Cannot access session data because ${reason}!`);
        },
        set() {
          throw new Error(`Cannot assign session data because ${reason}!`);
        },
      });

      await next();
    } else {
      const storage = getStorage(ctx);
      ctx[options.name] = (await storage.read(key)) ?? options.initial(ctx);
      await next();
      await storage.write(key, ctx[options.name]);
    }
  };
};
