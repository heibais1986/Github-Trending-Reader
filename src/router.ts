/**
 * Express-style Router for Cloudflare Worker
 * Handles API routing with middleware support
 */

export interface RouteHandler {
  (request: Request, env: any, ctx: ExecutionContext, params?: Record<string, string>): Promise<Response>;
}

export interface Middleware {
  (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response>;
}

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
  middlewares: Middleware[];
}

export class Router {
  private routes: Route[] = [];
  private globalMiddlewares: Middleware[] = [];

  /**
   * Add global middleware that runs for all routes
   */
  use(middleware: Middleware): void {
    this.globalMiddlewares.push(middleware);
  }

  /**
   * Add GET route
   */
  get(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.addRoute('GET', path, handler, middlewares);
  }

  /**
   * Add POST route
   */
  post(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.addRoute('POST', path, handler, middlewares);
  }

  /**
   * Add PUT route
   */
  put(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.addRoute('PUT', path, handler, middlewares);
  }

  /**
   * Add DELETE route
   */
  delete(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.addRoute('DELETE', path, handler, middlewares);
  }

  /**
   * Handle incoming request
   */
  async handle(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return this.handleCORSPreflight(request);
    }

    // Run global middlewares first
    for (const middleware of this.globalMiddlewares) {
      const result = await middleware(request, env, ctx);
      if (result instanceof Response) {
        return result;
      }
      if (result instanceof Request) {
        request = result;
      }
    }

    // Find matching route
    const matchedRoute = this.findMatchingRoute(method, pathname);
    if (!matchedRoute) {
      return this.createErrorResponse(404, 'NOT_FOUND', 'Route not found');
    }

    const { route, params } = matchedRoute;

    try {
      // Run route-specific middlewares
      for (const middleware of route.middlewares) {
        const result = await middleware(request, env, ctx);
        if (result instanceof Response) {
          return result;
        }
        if (result instanceof Request) {
          request = result;
        }
      }

      // Execute route handler
      return await route.handler(request, env, ctx, params);

    } catch (error) {
      console.error('Route handler error:', error);
      return this.createErrorResponse(
        500,
        'INTERNAL_ERROR',
        'Internal server error',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Private methods
   */
  private addRoute(method: string, path: string, handler: RouteHandler, middlewares: Middleware[]): void {
    this.routes.push({
      method: method.toUpperCase(),
      path,
      handler,
      middlewares,
    });
  }

  private findMatchingRoute(method: string, pathname: string): { route: Route; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) {
        continue;
      }

      const params = this.matchPath(route.path, pathname);
      if (params !== null) {
        return { route, params };
      }
    }

    return null;
  }

  private matchPath(routePath: string, requestPath: string): Record<string, string> | null {
    // Handle wildcard routes
    if (routePath === '*') {
      return {};
    }

    // Simple path matching with parameter support
    // Convert route path to regex pattern
    const paramNames: string[] = [];
    let regexPattern = routePath
      .replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1)); // Remove ':' prefix
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    // Handle wildcards at the end of paths
    if (regexPattern.endsWith('\\*')) {
      regexPattern = regexPattern.slice(0, -2) + '.*';
    }

    const regex = new RegExp(`^${regexPattern}$`);
    const match = requestPath.match(regex);

    if (!match) {
      return null;
    }

    // Extract parameters
    const params: Record<string, string> = {};
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = decodeURIComponent(match[i + 1]);
    }

    return params;
  }

  private handleCORSPreflight(request: Request): Response {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });

    return new Response(null, {
      status: 200,
      headers,
    });
  }

  private createErrorResponse(
    status: number,
    code: string,
    message: string,
    details?: string
  ): Response {
    return createErrorResponse(status, code, message, details);
  }
}

/**
 * Utility function to create JSON response with CORS headers
 */
export function createJSONResponse(data: any, status: number = 200): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none';",
    // Cache headers for successful responses
    'Cache-Control': status === 200 ? 'public, max-age=300, s-maxage=300' : 'no-cache',
    'Vary': 'Accept-Encoding',
  });

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

/**
 * Utility function to create error response
 */
export function createErrorResponse(
  status: number,
  code: string,
  message: string,
  details?: string
): Response {
  const errorBody = {
    error: {
      code,
      message,
      details: details || `HTTP ${status}`,
    },
    timestamp: new Date().toISOString(),
  };

  const headers = new Headers({
    'Content-Type': 'application/json',
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none';",
    // No cache for errors
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  return new Response(JSON.stringify(errorBody), {
    status,
    headers,
  });
}