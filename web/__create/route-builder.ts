import { access, readdir, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { cwd } from 'node:process';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

// Source-relative API directory used in development. In production, the server
// runs from build/server, so this path may not exist and must not be assumed.
const sourceRelativeApiDir = join(fileURLToPath(new URL('.', import.meta.url)), '../src/app/api');
const apiRouteModules = import.meta.glob<Record<string, RouteHandler>>('../src/app/api/**/route.js');

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

type RouteHandler = (request: Request, context: { params: Record<string, string> }) => Response | Promise<Response>;

type RouteFile = {
  id: string;
  filePath?: string;
  rootDir?: string;
  loader?: () => Promise<Record<string, RouteHandler>>;
};

async function directoryExists(dir: string): Promise<boolean> {
  try {
    await access(dir, constants.R_OK);
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function getApiDirectoryCandidates() {
  return unique([
    sourceRelativeApiDir,
    join(cwd(), 'src/app/api'),
    join(cwd(), 'app/api'),
    join(cwd(), 'web/src/app/api'),
  ]);
}

// Recursively find all route.js files. Missing directories are skipped so a
// production build cannot crash while scanning build/server/src/app/api.
async function findRouteFiles(dir: string, rootDir = dir): Promise<RouteFile[]> {
  if (!(await directoryExists(dir))) {
    console.warn(`Skipping API route scan; directory does not exist: ${dir}`);
    return [];
  }

  const files = await readdir(dir);
  let routes: RouteFile[] = [];

  for (const file of files) {
    try {
      const filePath = join(dir, file);
      const statResult = await stat(filePath);

      if (statResult.isDirectory()) {
        routes = routes.concat(await findRouteFiles(filePath, rootDir));
      } else if (file === 'route.js') {
        const routeFile = { id: filePath, filePath, rootDir };
        // Handle root route.js specially
        if (filePath === join(rootDir, 'route.js')) {
          routes.unshift(routeFile); // Add to beginning of array
        } else {
          routes.push(routeFile);
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return routes;
}

async function findApiRouteFiles(): Promise<RouteFile[]> {
  const candidates = getApiDirectoryCandidates();
  const existingCandidates = [];
  for (const candidate of candidates) {
    if (await directoryExists(candidate)) existingCandidates.push(candidate);
  }

  if (existingCandidates.length === 0) {
    console.warn(
      `No API route directories found. Skipping filesystem API scan. Checked: ${candidates.join(', ')}`
    );
    return [];
  }

  const routes: RouteFile[] = [];
  for (const dir of existingCandidates) {
    routes.push(...(await findRouteFiles(dir, dir)));
  }
  return routes;
}

function getGlobRouteFiles(): RouteFile[] {
  return Object.entries(apiRouteModules).map(([id, loader]) => ({ id, loader }));
}

// Helper function to transform file path to Hono route path
function getHonoPath(routeFile: RouteFile): { name: string; pattern: string }[] {
  const relativePath = routeFile.filePath && routeFile.rootDir
    ? relative(routeFile.rootDir, routeFile.filePath)
    : routeFile.id.replace(/^\.\.\/src\/app\/api\//, '');
  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1); // Remove 'route.js'
  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }
  const transformedParts = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
  return transformedParts;
}

async function loadRouteModule(routeFile: RouteFile) {
  if (routeFile.loader) return routeFile.loader();
  return import(/* @vite-ignore */ `${routeFile.filePath}?update=${Date.now()}`);
}

// Import and register all routes
async function registerRoutes() {
  let routeFiles = await findApiRouteFiles();

  // Production builds may not include source files on disk. Fall back to Vite's
  // manifest-backed glob modules so pages still render and APIs can register.
  if (routeFiles.length === 0) {
    routeFiles = getGlobRouteFiles();
  }

  routeFiles = routeFiles.slice().sort((a, b) => b.id.length - a.id.length);

  // Clear existing routes
  api.routes = [];

  for (const routeFile of routeFiles) {
    try {
      const route = await loadRouteModule(routeFile) as Record<string, RouteHandler>;

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of methods) {
        try {
          if (route[method]) {
            const parts = getHonoPath(routeFile);
            const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;
            const handler: Handler = async (c) => {
              const params = c.req.param();
              if (import.meta.env.DEV && routeFile.filePath) {
                const updatedRoute = await import(
                  /* @vite-ignore */ `${routeFile.filePath}?update=${Date.now()}`
                );
                return await updatedRoute[method](c.req.raw, { params });
              }
              return await route[method](c.req.raw, { params });
            };
            const methodLowercase = method.toLowerCase();
            switch (methodLowercase) {
              case 'get':
                api.get(honoPath, handler);
                break;
              case 'post':
                api.post(honoPath, handler);
                break;
              case 'put':
                api.put(honoPath, handler);
                break;
              case 'delete':
                api.delete(honoPath, handler);
                break;
              case 'patch':
                api.patch(honoPath, handler);
                break;
              default:
                console.warn(`Unsupported method: ${method}`);
                break;
            }
          }
        } catch (error) {
          console.error(`Error registering route ${routeFile.id} for method ${method}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error importing route file ${routeFile.id}:`, error);
    }
  }
}

// Initial route registration should never prevent the server from starting.
await registerRoutes().catch((error) => {
  console.warn('API route auto-registration failed; continuing without registered API routes:', error);
});

// Hot reload routes in development
if (import.meta.env.DEV) {
  import.meta.glob('../src/app/api/**/route.js', {
    eager: true,
  });
  if (import.meta.hot) {
    import.meta.hot.accept((newSelf) => {
      registerRoutes().catch((err) => {
        console.error('Error reloading routes:', err);
      });
    });
  }
}

export { api, API_BASENAME };
