import * as THREE from 'three';
import { getWidthWithGap, normalizePosition } from './three-utils';

interface MouseControlOptions {
  gap: number;
  slideAmount: number;
  sensitivity: number; // Чувствительность мыши (default: 1)
}

/**
 * Менеджер для управления слайдером мышью с snap-to-center функциональностью
 */
export class MouseControl {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private options: MouseControlOptions;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startSceneX: number = 0;
  private currentX: number = 0;
  private targetX: number = 0;
  private isAnimating: boolean = false;
  private animationId: number | undefined;

  constructor(
    container: HTMLElement,
    scene: THREE.Scene,
    options: MouseControlOptions
  ) {
    this.container = container;
    this.scene = scene;
    this.options = { ...options, sensitivity: options.sensitivity ?? 1 };
    this.targetX = scene.position.x;
    this.setupEventListeners();
  }

  /**
   * Настраивает обработчики событий мыши и touch
   */
  private setupEventListeners(): void {
    // Mouse events
    this.container.addEventListener('mousedown', this.handleMouseDown);
    this.container.addEventListener('mousemove', this.handleMouseMove);
    this.container.addEventListener('mouseup', this.handleMouseUp);
    this.container.addEventListener('mouseleave', this.handleMouseUp);

    // Touch events для мобильных устройств
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    this.container.style.cursor = 'grab';
    this.container.style.touchAction = 'pan-y';
  }

  /**
   * Обработчик нажатия мыши
   */
  private handleMouseDown = (e: MouseEvent): void => {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startSceneX = this.scene.position.x;
    this.container.style.cursor = 'grabbing';
  };

  /**
   * Обработчик движения мыши
   */
  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    const deltaX = (e.clientX - this.startX) * this.options.sensitivity;
    const newX = this.startSceneX + deltaX;

    // Нормализуем позицию для бесконечного зацикливания
    this.scene.position.x = normalizePosition(
      newX,
      this.options.gap,
      this.options.slideAmount
    );
    this.currentX = this.scene.position.x;
  };

  /**
   * Обработчик отпускания мыши - запускает snap-to-center
   */
  private handleMouseUp = (): void => {
    this.endDrag();
  };

  /**
   * Обработчик touch start
   */
  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startSceneX = this.scene.position.x;
    }
  };

  /**
   * Обработчик touch move
   */
  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.isDragging || e.touches.length === 0) return;

    const deltaX = (e.touches[0].clientX - this.startX) * this.options.sensitivity;
    const newX = this.startSceneX + deltaX;

    // Нормализуем позицию для бесконечного зацикливания
    this.scene.position.x = normalizePosition(
      newX,
      this.options.gap,
      this.options.slideAmount
    );
    this.currentX = this.scene.position.x;
  };

  /**
   * Обработчик touch end
   */
  private handleTouchEnd = (): void => {
    this.endDrag();
  };

  /**
   * Завершает перетаскивание и запускает snap-to-center
   */
  private endDrag(): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.container.style.cursor = 'grab';

    // Вычисляем ближайшую позицию для центрирования
    this.targetX = this.calculateSnapPosition(this.currentX);
    this.startSnapAnimation();
  }

  /**
   * Вычисляет ближайшую позицию для snap-to-center
   * Центрирует слайд так, чтобы центральный кадр был в центре
   */
  private calculateSnapPosition(currentX: number): number {
    const planeWidth = getWidthWithGap(this.options.gap);
    const slideWidth = planeWidth;

    // Вычисляем, какой слайд должен быть в центре
    // Центр экрана = 0 в координатах сцены
    const offsetFromCenter = currentX;
    const slideIndex = Math.round(offsetFromCenter / slideWidth);
    const targetOffset = slideIndex * slideWidth;

    // Нормализуем целевую позицию для бесконечного зацикливания
    return normalizePosition(targetOffset, this.options.gap, this.options.slideAmount);
  }

  /**
   * Запускает плавную анимацию к целевой позиции (snap-to-center)
   */
  private startSnapAnimation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const startX = this.scene.position.x;
    const distance = this.targetX - startX;
    const duration = 300; // миллисекунды
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing функция (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.scene.position.x = startX + distance * easeOut;

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.scene.position.x = this.targetX;
        this.isAnimating = false;
        this.animationId = undefined;
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Обновляет опции управления мышью
   */
  updateOptions(options: Partial<MouseControlOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Останавливает все анимации и очищает обработчики
   */
  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    this.container.removeEventListener('mousedown', this.handleMouseDown);
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('mouseleave', this.handleMouseUp);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.style.cursor = '';
    this.container.style.touchAction = '';
  }

  /**
   * Получает текущую позицию сцены
   */
  getCurrentPosition(): number {
    return this.scene.position.x;
  }

  /**
   * Устанавливает позицию сцены напрямую (для внешнего управления)
   */
  setPosition(x: number): void {
    this.scene.position.x = normalizePosition(
      x,
      this.options.gap,
      this.options.slideAmount
    );
  }
}

