declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import type { WebGLRenderer } from 'three';
  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: unknown): void;
    render(): void;
    setSize(width: number, height: number): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import type { Camera, Scene } from 'three';
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import type { Vector2 } from 'three';
  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
    strength: number;
    radius: number;
    threshold: number;
  }
} 