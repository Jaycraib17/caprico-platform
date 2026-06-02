import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	type RouteConfigEntry,
	index,
	route,
} from '@react-router/dev/routes';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

type Tree = {
	path: string;
	children: Tree[];
	hasPage: boolean;
	isParam: boolean;
	paramName: string;
	isCatchAll: boolean;
};

function buildRouteTree(dir: string, basePath = ''): Tree {
	const files = readdirSync(dir);

	const node: Tree = {
		path: basePath,
		children: [],
		hasPage: false,
		isParam: false,
		isCatchAll: false,
		paramName: '',
	};

	const dirName = basePath.split('/').pop();

	if (dirName?.startsWith('[') && dirName.endsWith(']')) {
		node.isParam = true;

		const paramName = dirName.slice(1, -1);

		if (paramName.startsWith('...')) {
			node.isCatchAll = true;
			node.paramName = paramName.slice(3);
		} else {
			node.paramName = paramName;
		}
	}

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			const childPath = basePath ? `${basePath}/${file}` : file;
			const childNode = buildRouteTree(filePath, childPath);
			node.children.push(childNode);
		} else if (file === 'page.jsx') {
			node.hasPage = true;
		}
	}

	return node;
}

function toRoutePath(path: string) {
	const segments = path.split('/');

	return segments
		.map((segment) => {
			if (segment.startsWith('[') && segment.endsWith(']')) {
				const paramName = segment.slice(1, -1);

				if (paramName.startsWith('...')) {
					return '*';
				}

				if (paramName.startsWith('[') && paramName.endsWith(']')) {
					return `:${paramName.slice(1, -1)}?`;
				}

				return `:${paramName}`;
			}

			return segment;
		})
		.join('/');
}

function generateRoutes(node: Tree, skipPaths = new Set<string>()): RouteConfigEntry[] {
	const routes: RouteConfigEntry[] = [];

	if (node.hasPage && !skipPaths.has(node.path)) {
		const componentPath =
			node.path === '' ? './page.jsx' : `./${node.path}/page.jsx`;

		if (node.path === '') {
			routes.push(index(componentPath));
		} else {
			routes.push(route(toRoutePath(node.path), componentPath));
		}
	}

	for (const child of node.children) {
		routes.push(...generateRoutes(child, skipPaths));
	}

	return routes;
}

if (import.meta.env.DEV) {
	import.meta.glob('./**/page.jsx', {});

	if (import.meta.hot) {
		import.meta.hot.accept((newSelf) => {
			import.meta.hot?.invalidate();
		});
	}
}

const tree = buildRouteTree(__dirname);

// Keep critical routes explicit so production builds do not miss them.
const explicitRoutePaths = new Set([
	'admin/jobs/new',
	'admin/jobs/add',
	'jobs/add',
]);

const explicitRoutes = [
	route('admin/jobs/new', './admin/jobs/new/page.jsx'),
	route('admin/jobs/add', './admin/jobs/add/page.jsx'),
	route('jobs/add', './jobs/add/page.jsx'),
];

const generatedRoutes = generateRoutes(tree, explicitRoutePaths);

const notFound = route('*?', './__create/not-found.tsx');

const routes = [...explicitRoutes, ...generatedRoutes, notFound];

export default routes;
