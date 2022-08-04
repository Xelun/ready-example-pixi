export * from '@pixi/constants';
export * from '@pixi/math';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
export * from '@pixi/utils';
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/loaders';
export * from '@pixi/sprite';
export * from '@pixi/app';
export * from '@pixi/spritesheet';
export * from '@pixi/text';
export * from '@pixi/interaction';
export * from '@pixi/graphics';
export * from '@pixi/graphics-extras';
export * from '@pixi/mesh';
export * from '@pixi/mesh-extras';
export * from '@pixi/sprite-animated';
export * from '@pixi/sprite-tiling';
export * from '@pixi/particle-container';
export * from '@pixi/text-bitmap';

import * as particles from "@pixi/particle-emitter";
export { particles };

import { Spine } from "pixi-spine";
export { Spine };

import { Easing } from '@tweenjs/tween.js';
export { Easing };

// Renderer plugins
import { Renderer } from '@pixi/core';
import { ParticleRenderer } from '@pixi/particle-container';
Renderer.registerPlugin('particle', ParticleRenderer);
import { TilingSpriteRenderer } from '@pixi/sprite-tiling';
Renderer.registerPlugin('tilingSprite', TilingSpriteRenderer);
import { BatchRenderer } from '@pixi/core';
Renderer.registerPlugin('batch', BatchRenderer);
import { InteractionManager } from '@pixi/interaction';
Renderer.registerPlugin('interaction', InteractionManager);

// Application plugins
import { Application } from '@pixi/app';
import { AppLoaderPlugin } from '@pixi/loaders';
Application.registerPlugin(AppLoaderPlugin);
import { TickerPlugin } from '@pixi/ticker';
Application.registerPlugin(TickerPlugin);

// Loader plugins
import { Loader } from '@pixi/loaders';
import { SpritesheetLoader } from '@pixi/spritesheet';
Loader.registerPlugin(SpritesheetLoader);