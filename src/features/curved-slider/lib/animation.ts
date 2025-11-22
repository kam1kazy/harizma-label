import * as THREE from 'three';
import { getWidthWithGap, normalizePosition } from './three-utils';

interface AnimationOptions {
  speed: number;
  gap: number;
  direction: number;
  slideAmount: number;
}

interface AnimationCallbacks {
  onFrame?: (time: number) => void;
  checkTextures?: () => void;
}

/**
 * Создает и управляет анимационным циклом для слайдера
 */
export class AnimationLoop {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private options: AnimationOptions;
  private callbacks: AnimationCallbacks;
  private animationId: number | undefined;
  private previousTime: number = 0;
  private time: number = 0;
  private textureCheckCounter: number = 0;
  private readonly TEXTURE_CHECK_INTERVAL = 10; // Проверка каждые N кадров
  private isPaused: boolean = false;
  private renderLoopId: number | undefined; // Отдельный цикл для рендеринга

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    options: AnimationOptions,
    callbacks: AnimationCallbacks = {}
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.options = options;
    this.callbacks = callbacks;
  }

  /**
   * Запускает анимационный цикл
   */
  start(autoPlay: boolean = true): void {
    this.isPaused = !autoPlay;

    // Всегда запускаем цикл рендеринга
    if (this.renderLoopId === undefined) {
      this.startRenderLoop();
    }

    // Запускаем анимацию только если autoPlay = true
    if (autoPlay && this.animationId === undefined) {
      this.animate(0);
    }
  }

  /**
   * Запускает цикл рендеринга (работает даже на паузе)
   */
  private startRenderLoop(): void {
    let textureCheckCounter = 0;
    const render = () => {
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera);

        // Проверяем текстуры и в цикле рендеринга (для случая когда анимация на паузе)
        textureCheckCounter++;
        if (textureCheckCounter >= this.TEXTURE_CHECK_INTERVAL) {
          if (this.callbacks.checkTextures) {
            this.callbacks.checkTextures();
          }
          textureCheckCounter = 0;
        }
      }
      this.renderLoopId = requestAnimationFrame(render);
    };
    // Делаем первый рендер сразу
    if (this.scene && this.camera && this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
    this.renderLoopId = requestAnimationFrame(render);
  }

  /**
   * Останавливает анимационный цикл
   */
  stop(): void {
    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
    if (this.renderLoopId !== undefined) {
      cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = undefined;
    }
  }

  /**
   * Ставит анимацию на паузу (рендеринг продолжается)
   */
  pause(): void {
    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
    this.isPaused = true;
  }

  /**
   * Возобновляет анимацию
   */
  resume(): void {
    if (this.isPaused && this.animationId === undefined) {
      this.isPaused = false;
      this.animate(performance.now());
    }
  }

  /**
   * Проверяет, на паузе ли анимация
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Сбрасывает таймер анимации
   */
  reset(): void {
    this.time = 0;
  }

  /**
   * Основной цикл анимации
   */
  private animate = (currentTime: number): void => {
    const timePassed = currentTime - this.previousTime;
    const { speed, gap, direction, slideAmount } = this.options;

    // Обновляем время и позицию сцены
    this.time += direction * timePassed * 0.00001;
    const rawPosition = this.time * speed;

    // Нормализуем позицию для бесконечного зацикливания без миганий
    this.scene.position.x = normalizePosition(rawPosition, gap, slideAmount);

    // Проверяем видимость плоскостей каждые N кадров (для оптимизации)
    this.textureCheckCounter++;
    if (this.textureCheckCounter >= this.TEXTURE_CHECK_INTERVAL) {
      if (this.callbacks.checkTextures) {
        this.callbacks.checkTextures();
      }
      this.textureCheckCounter = 0;
    }

    // Рендеринг происходит в отдельном цикле, здесь не нужно

    // Вызываем callback на каждом кадре, если предоставлен
    if (this.callbacks.onFrame) {
      this.callbacks.onFrame(currentTime);
    }

    this.previousTime = currentTime;
    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Обновляет опции анимации
   */
  updateOptions(options: Partial<AnimationOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Получает текущее время анимации
   */
  getTime(): number {
    return this.time;
  }
}

