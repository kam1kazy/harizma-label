import * as THREE from 'three';

/**
 * Вычисляет ширину плоскости в 3D пространстве на основе размеров контейнера и камеры
 */
export function getPlaneWidth(el: HTMLElement, camera: THREE.PerspectiveCamera): number {
  const vFov = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFov / 2) * camera.position.z;
  const aspect = el.clientWidth / el.clientHeight;
  const width = height * aspect;
  return el.clientWidth / width;
}

/**
 * Вычисляет ширину с учетом зазора между плоскостями
 */
export function getWidthWithGap(gapPercent: number): number {
  return 1 + gapPercent / 100;
}

/**
 * Вычисляет пространство между плоскостями
 */
export function calculatePlaneSpace(
  el: HTMLElement,
  camera: THREE.PerspectiveCamera,
  gap: number
): number {
  return getPlaneWidth(el, camera) * getWidthWithGap(gap);
}

/**
 * Вычисляет начальное смещение для центрирования слайдов
 */
export function calculateInitialOffset(el: HTMLElement, planeSpace: number): number {
  return Math.ceil(el.clientWidth / (2 * planeSpace) - 0.5);
}

/**
 * Вычисляет общее количество изображений для бесшовного цикла
 */
export function calculateTotalImages(
  el: HTMLElement,
  planeSpace: number,
  slideAmount: number
): number {
  return Math.max(Math.ceil(el.clientWidth / planeSpace) + 1 + slideAmount, slideAmount * 2);
}

/**
 * Дублирует массив изображений для создания бесшовного цикла
 */
export function duplicateImagesForLoop(images: string[], totalImages: number): string[] {
  const slideAmount = images.length;
  const allImages = [...images];
  for (let i = slideAmount; i < totalImages; i++) {
    allImages.push(images[i % slideAmount]);
  }
  return allImages;
}

/**
 * Проверяет, находится ли плоскость в видимой области экрана
 */
export function isPlaneInView(
  plane: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  el: HTMLElement,
  thresholdPercent: number = 0.3
): boolean {
  if (!plane) return false;

  // Вычисляем мировые координаты плоскости
  const worldPosition = new THREE.Vector3();
  plane.getWorldPosition(worldPosition);

  // Проектируем позицию на экран
  worldPosition.project(camera);

  // Преобразуем в координаты экрана
  const x = (worldPosition.x * 0.5 + 0.5) * el.clientWidth;
  const y = (worldPosition.y * -0.5 + 0.5) * el.clientHeight;

  // Добавляем запас (threshold) для предзагрузки
  const threshold = el.clientWidth * thresholdPercent;

  // Проверяем, находится ли плоскость в видимой области или рядом с ней
  return x >= -threshold && x <= el.clientWidth + threshold;
}

/**
 * Нормализует позицию для бесконечного зацикливания
 * Возвращает позицию в пределах одного цикла слайдов
 * Использует модульную арифметику для эффективного зацикливания
 */
export function normalizePosition(
  position: number,
  gap: number,
  slideAmount: number
): number {
  const cycleWidth = getWidthWithGap(gap) * slideAmount;

  if (cycleWidth === 0) return position;

  // Нормализуем позицию в диапазоне [-cycleWidth/2, cycleWidth/2)
  // Используем модульную арифметику для эффективности
  const halfCycle = cycleWidth / 2;
  const normalized = ((position + halfCycle) % cycleWidth) - halfCycle;

  // Обрабатываем случай, когда результат отрицательный из-за модуля
  return normalized < -halfCycle ? normalized + cycleWidth : normalized;
}


