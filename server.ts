import { createRequestHandler, type ServerBuild } from "@remix-run/cloudflare";
import * as build from "./build/server";
import { getLoadContext } from "./load-context";

const handleRemixRequest = createRequestHandler(build as any as ServerBuild);

export default {
    async fetch(request, env, ctx) {
        try {
            const loadContext = getLoadContext({
                request,
                context: {
                    cloudflare: {
                        // This object matches the return value from Wrangler's
                        // `getPlatformProxy` used during development via Remix's
                        // `cloudflareDevProxyVitePlugin`:
                        // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
                        cf: request.cf,
                        ctx: {
                            waitUntil: ctx.waitUntil.bind(ctx),
                            passThroughOnException: ctx.passThroughOnException.bind(ctx),
                        },
                        caches,
                        env,
                    },
                },
            });
            return await handleRemixRequest(request, loadContext);
        } catch (error) {
            console.log(error);
            return new Response("An unexpected error occurred", { status: 500 });
        }
    },
} satisfies ExportedHandler<Env>;
