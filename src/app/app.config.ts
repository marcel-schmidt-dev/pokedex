/**
 * @fileoverview
 * This file defines the main application configuration for the Pokedex app.
 * It includes providers for routing and optimized zone change detection.
 *
 * @module AppConfig
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * The application configuration object for the Pokedex app.
 *
 * @constant {ApplicationConfig} appConfig
 * @description
 * This configuration includes:
 * - **Zone change detection** with event coalescing enabled for performance optimization.
 * - **Routing** using the application's routes defined in `app.routes.ts`.
 *
 * @see https://angular.io/api/core/provideZoneChangeDetection
 * @see https://angular.io/api/router/provideRouter
 *
 * @property {Provider[]} providers - An array of providers for the app, including:
 * - `provideZoneChangeDetection`: Configures optimized change detection.
 * - `provideRouter`: Configures the app's routing.
 *
 * @example
 * ```typescript
 * import { appConfig } from './app.config';
 * ```
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Zone change detection with event coalescing to improve performance
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configures the application's routes
    provideRouter(routes),
  ],
};
