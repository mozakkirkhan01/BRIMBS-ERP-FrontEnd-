import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  // Specify which routes to reuse
  private reusableRoutes = ['pupil-list','admin-dashboard']; // Add your reusable routes here

  // Determine if the route should be detached (cached)
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isReusable(route);
  }

  // Store the detached route handle (cache it)
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (handle) {
      this.handlers[route.routeConfig?.path || ''] = handle;
    }
  }

  // Determine if the route should be reattached (restored from cache)
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[route.routeConfig?.path || ''] && this.isReusable(route);
  }

  // Retrieve the stored route handle (if it exists)
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || !this.isReusable(route)) {
      return null;
    }
    return this.handlers[route.routeConfig?.path || ''];
  }

  // Allow reuse of the route if the component is the same
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // Helper method to check if the route is reusable
  private isReusable(route: ActivatedRouteSnapshot): boolean {
    return this.reusableRoutes.includes(route.routeConfig?.path || '');
  }
}
