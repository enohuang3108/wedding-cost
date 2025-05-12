import { expect as baseExpect, test as baseTest } from "@playwright/test";
import { type SetupServer, setupServer } from "msw/node";
import { type ViteDevServer, createServer } from "vite";
import { type PlatformProxy, getPlatformProxy } from "wrangler";

// 定義 Env 類型
interface Env {
	cache: KVNamespace;
	// 可以添加其他必要的環境變量
}

interface WorkerFixtures {
	port: number;
	wrangler: PlatformProxy<Env>;
	server: ViteDevServer;
	msw: SetupServer;
}

export async function clearKV(namespace: KVNamespace): Promise<void> {
    const result = await namespace.list();

    await Promise.all(result.keys.map(key => namespace.delete(key.name)));
}

export const expect = baseExpect.extend({});

export const test = baseTest.extend<WorkerFixtures>({
    // Assign a unique "port" for each worker process
    port: [
         
        async ({}, use, workerInfo) => {
            await use(3515 + workerInfo.workerIndex);
        },
        { scope: "worker" },
    ],

    // Ensure visits works with relative path
    baseURL: ({ port }, use) => {
        use(`http://localhost:${port}`);
    },

    // Start a Vite dev server for each worker
    // This allows MSW to intercept requests properly
    server: [
        async ({ port }, use) => {
            const server = await createServer({
                configFile: "./vite.config.ts",
            });

            await server.listen(port);

            await use(server);

            await server.close();
        },
        { scope: "worker", auto: true },
    ],

    msw: [
         
        async ({}, use) => {
            const server = setupServer();

            server.listen();

            await use(server);

            server.close();
        },
        { scope: "worker", auto: true },
    ],

    // To access wrangler bindings similar to Remix / Vite
    wrangler: [
         
        async ({}, use) => {
            const wrangler = await getPlatformProxy<Env>();

            // To access bindings in the tests.
            await use(wrangler);

            // Ensure all cachees are cleaned up
            await clearKV(wrangler.env.cache);

            await wrangler.dispose();
        },
        { scope: "worker", auto: true },
    ],
});

// 不要在配置文件中直接使用 test.beforeEach
// 改為導出一個設置函數，讓測試文件可以使用
export function setupMswReset() {
    return ({ msw }: { msw: SetupServer }) => {
        msw.resetHandlers();
    };
}
