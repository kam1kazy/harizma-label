import * as THREE from 'three';
import {
  calculatePlaneSpace,
  calculateInitialOffset,
  calculateTotalImages,
  duplicateImagesForLoop,
  getWidthWithGap,
} from './three-utils';
import { createPlaceholderMaterial } from './materials';

interface SceneInitParams {
  el: HTMLElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  images: string[];
  options: {
    gap: number;
    direction: number;
    curve: number;
  };
}

interface SceneInitResult {
  geometry: THREE.PlaneGeometry;
  planes: THREE.Mesh[];
  planeSpace: number;
  initialOffset: number;
}

/**
 * Инициализирует Three.js сцену, создавая плоскости для слайдов
 */
export function initializeScene(params: SceneInitParams): SceneInitResult | null {
  const { el, camera, scene, images, options } = params;
  const { gap, direction, curve } = options;

  // Вычисляем пространство между плоскостями
  const planeSpace = calculatePlaneSpace(el, camera, gap);

  // Проверка валидности planeSpace
  if (planeSpace <= 0 || !isFinite(planeSpace)) {
    return null;
  }

  const slideAmount = images.length;
  const totalImages = calculateTotalImages(el, planeSpace, slideAmount);
  const initialOffset = calculateInitialOffset(el, planeSpace);

  // Дублируем изображения для бесшовного цикла
  const allImages = duplicateImagesForLoop(images, totalImages);

  // Создаем геометрию плоскости
  const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  // Создаем плоскости с placeholder материалами
  const planes: THREE.Mesh[] = [];

  allImages.forEach((imageSrc, i) => {
    const material = createPlaceholderMaterial(curve);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.x = -1 * direction * (i - initialOffset) * getWidthWithGap(gap);
    scene.add(plane);
    planes[i] = plane;

    // Сохраняем ссылку на исходное изображение для загрузки
    (plane as any).userData = { imageSrc, index: i };
  });

  return {
    geometry,
    planes,
    planeSpace,
    initialOffset,
  };
}

/**
 * Создает и инициализирует Three.js рендерер
 */
export function createRenderer(
  el: HTMLElement,
  existingCanvas?: HTMLCanvasElement | null
): THREE.WebGLRenderer {
  // Удаляем предыдущий canvas, если есть
  if (existingCanvas) {
    el.removeChild(existingCanvas);
  }

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(el.clientWidth, el.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Убеждаемся, что canvas виден
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  el.appendChild(canvas);

  return renderer;
}

/**
 * Создает и настраивает камеру для слайдера
 */
export function createCamera(el: HTMLElement): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 20);
  camera.position.z = 2;
  return camera;
}

