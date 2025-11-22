import * as THREE from 'three';
import { isPlaneInView } from './three-utils';
import { createShaderMaterial } from './materials';

interface PlaneUserData {
  imageSrc: string;
  index: number;
}

/**
 * Менеджер для ленивой загрузки текстур слайдов
 */
export class TextureLoaderManager {
  private textures: Map<number, THREE.Texture> = new Map();
  private loading: Set<number> = new Set();
  private loader: THREE.TextureLoader;
  private curve: number;

  constructor(curve: number) {
    this.curve = curve;
    this.loader = new THREE.TextureLoader();
  }

  /**
   * Проверяет, загружена ли текстура для данной плоскости
   */
  isTextureLoaded(planeIndex: number): boolean {
    return this.textures.has(planeIndex);
  }

  /**
   * Проверяет, загружается ли текстура для данной плоскости
   */
  isTextureLoading(planeIndex: number): boolean {
    return this.loading.has(planeIndex);
  }

  /**
   * Загружает текстуру для плоскости и обновляет её материал
   */
  loadTextureForPlane(
    planeIndex: number,
    imageSrc: string,
    plane: THREE.Mesh,
    onComplete?: () => void
  ): void {
    // Если текстура уже загружена или загружается, пропускаем
    if (this.textures.has(planeIndex) || this.loading.has(planeIndex)) {
      return;
    }

    this.loading.add(planeIndex);

    this.loader.load(
      imageSrc,
      (texture: THREE.Texture) => {
        if (!plane) {
          this.loading.delete(planeIndex);
          return;
        }

        // Создаем новый материал с загруженной текстурой
        const material = createShaderMaterial(texture, this.curve);

        // Обновляем материал плоскости
        const oldMaterial = plane.material as THREE.ShaderMaterial;
        plane.material = material;

        // Очищаем старый материал
        oldMaterial.dispose();

        // Сохраняем текстуру
        this.textures.set(planeIndex, texture);
        this.loading.delete(planeIndex);

        if (onComplete) {
          onComplete();
        }
      },
      undefined,
      (error: any) => {
        console.error(`Error loading texture for plane ${planeIndex}:`, error);
        this.loading.delete(planeIndex);
      }
    );
  }

  /**
   * Проверяет видимость плоскостей и загружает текстуры для видимых
   */
  checkAndLoadVisibleTextures(
    planes: THREE.Mesh[],
    camera: THREE.PerspectiveCamera,
    el: HTMLElement
  ): void {
    planes.forEach((plane, index) => {
      if (!plane) return;

      const userData = (plane as any).userData as PlaneUserData | undefined;
      if (!userData || !userData.imageSrc) return;

      // Пропускаем, если текстура уже загружена или загружается
      if (this.isTextureLoaded(index) || this.isTextureLoading(index)) {
        return;
      }

      // Проверяем видимость и загружаем текстуру
      if (isPlaneInView(plane, camera, el)) {
        this.loadTextureForPlane(index, userData.imageSrc, plane);
      }
    });
  }

  /**
   * Очищает все загруженные текстуры
   */
  dispose(): void {
    this.textures.forEach((texture) => {
      texture.dispose();
    });
    this.textures.clear();
    this.loading.clear();
  }

  /**
   * Получает загруженную текстуру по индексу
   */
  getTexture(planeIndex: number): THREE.Texture | undefined {
    return this.textures.get(planeIndex);
  }
}

