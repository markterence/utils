/**
 * Custom module/plugin loader
 *
 * Copyright (C) 2024 Mark Terence Tiglao (markterencetiglao@proton.me)
 *
 * This file is used to load user modules/plugins
 */
/// <reference types="vite/client" />
import type { App } from 'vue';

export interface UserModuleContext {
  /**
   * Vue app
   */
  app: App;

  /**
   * Vue router instance
   */
  router: any;
  env: Record<string, any>;
}

export interface LoadUserModulePrivateContext extends UserModuleContext {
  _mountedHooks: (() => void)[];
  addToContext: (obj: Record<string, any>) => void;
  appMounted: (hook: () => void) => void;
}

export interface IUserModule {
  install: (ctx: UserModuleContext) => void;
}

export interface LoadUserModuleOptions {
  /**
   * Directory where the user modules are located.
   * Defaults to './plugins'.
   */
  pluginsDirectory?: string;
  /**
   * List of plugin file names to load. The file names should be relative to the `pluginsDirectory`.
   *
   * For example, if the file is located at `./plugins/my-plugin.ts`, you
   * should include it as `my-plugin.ts` in the list.
   *
   * @example
   * ```ts
   * loadUserModules(ctx, {
   *   plugins: ['pinia.ts', 'vue-router.ts']
   * });
   */
  plugins?: string[];
}

/**
 *
 * @param ctx Context object that will be passed to the user modules.
 * @param plugins List of plugin file names to load.
 */
export function loadUserModules(ctx: UserModuleContext, options: LoadUserModuleOptions): void {
  const { pluginsDirectory = './plugins', plugins = [] } = options;
  const _ctx = ctx as LoadUserModulePrivateContext;
  _ctx._mountedHooks = [];

  // Store the appMounted hooks execute them later when the app is mounted
  // The logic here is that `.appMounted` is injected into the ctx.
  // The ctx is passed to the user modules during the loop on [UM-1] below.
  // See the 2nd response from ChatGPT for more context: https://chat.openai.com/share/bf5fae1b-2a27-40cb-acad-c96dfcc6155e
  _ctx.appMounted = (hook: () => void) => {
    _ctx._mountedHooks.push(hook);
  };

  // [UM-API]: Function to add something to the context
  const addToContext = (obj: Record<string, any>): void => {
    Object.assign(ctx, obj);
    Object.assign(_ctx, obj);
  };
  _ctx.addToContext = addToContext;

  const globPattern = (): string[] => {
    return [`${pluginsDirectory}/*.ts`, `!${pluginsDirectory}/index.ts`, `!${pluginsDirectory}/*.d.ts`];
  };
  const userModules = import.meta.glob<{ install: any }>(globPattern(), {
    eager: true,
  });

  logLoadedModules(Object.keys(userModules));

  // [UM-1]: Load the plugins in the order they are defined
  for (const userModulePath of plugins) {
    const userModule: IUserModule = userModules[userModulePath];

    if (!userModule) {
      console.error(`[loadUserModules] - User module "${userModulePath}" not found. Please make sure the file exists.`);
      continue;
    }

    userModule.install?.(ctx);
    if (import.meta.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(`[loadUserModules] - Loaded user module: ${userModulePath}`);
    }
  }
}

// Execute the app mounted hooks.
// This is called on the `main.ts` file after the app is mounted.
export function triggerAppMountedHooks(ctx: any): void {
  ctx._mountedHooks.forEach((hook: () => void) => hook());
}

function logLoadedModules(userModulesStr: string[]): void {
  const userModulesLocation = userModulesStr.map((e) => {
    // include the base path
    return e.replace('./', './plugins/');
  });
  // eslint-disable-next-line no-console
  console.debug(`[loadUserModules] - List of user modules:\r\n\t${userModulesLocation.join('\r\n\t')}`);
}
