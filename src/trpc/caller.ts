import "server-only";

import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

/** Server-component data access: `const api = await getApi(); await api.post.list(...)` */
export async function getApi() {
  return createCallerFactory(appRouter)(await createTRPCContext());
}
