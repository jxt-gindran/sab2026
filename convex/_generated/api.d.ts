/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as cyclists from "../cyclists.js";
import type * as donations from "../donations.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as maps from "../maps.js";
import type * as payments from "../payments.js";
import type * as riders from "../riders.js";
import type * as translations from "../translations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  cyclists: typeof cyclists;
  donations: typeof donations;
  email: typeof email;
  http: typeof http;
  maps: typeof maps;
  payments: typeof payments;
  riders: typeof riders;
  translations: typeof translations;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
