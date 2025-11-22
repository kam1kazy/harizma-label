'use client';

import { CurvedSliderOptions } from '@/entities/carousel';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AnimationLoop } from './animation';
import { MouseControl } from './mouse-control';
import { createCamera, createRenderer, initializeScene } from './scene-init';
import { TextureLoaderManager } from './texture-loader';

export interface UseCurvedSliderProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: string[];
  options: CurvedSliderOptions;
}

export const useCurvedSlider = ({ containerRef, images, options }: UseCurvedSliderProps) => {
  const sceneRef = useRef<THREE.Scene | undefined>(undefined);
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined);
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined);
  const planesRef = useRef<THREE.Mesh[]>([]);
  const textureLoaderRef = useRef<TextureLoaderManager | undefined>(undefined);
  const animationLoopRef = useRef<AnimationLoop | undefined>(undefined);
  const mouseControlRef = useRef<MouseControl | undefined>(undefined);
  const initTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    const { speed = 30, gap = 10, curve = 12, direction = -1, autoPlay = false } = options;
    const el = containerRef.current;
    const slideAmount = images.length;

    // Функция инициализации
    const initSlider = () => {
      // Очищаем предыдущий таймаут
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = undefined;
      }

      // Проверка валидности размеров контейнера
      if (el.clientWidth === 0 || el.clientHeight === 0) {
        // Повторная попытка через небольшой таймаут
        initTimeoutRef.current = setTimeout(initSlider, 100);
        return;
      }

      // Останавливаем предыдущую анимацию, если есть
      if (animationLoopRef.current) {
        animationLoopRef.current.stop();
        animationLoopRef.current = undefined;
      }

      // Очищаем управление мышью
      if (mouseControlRef.current) {
        mouseControlRef.current.dispose();
        mouseControlRef.current = undefined;
      }

      // Очищаем предыдущие текстуры
      if (textureLoaderRef.current) {
        textureLoaderRef.current.dispose();
        textureLoaderRef.current = undefined;
      }

      // Удаляем предыдущий canvas, если есть
      const existingCanvas = el.querySelector('canvas');

      // Инициализация сцены
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Создаем камеру
      const camera = createCamera(el);
      cameraRef.current = camera;

      // Создаем рендерер
      const renderer = createRenderer(el, existingCanvas);
      rendererRef.current = renderer;

      // Инициализируем менеджер загрузки текстур
      const textureLoader = new TextureLoaderManager(curve);
      textureLoaderRef.current = textureLoader;

      // Инициализируем сцену с плоскостями
      const sceneInitResult = initializeScene({
        el,
        camera,
        scene,
        images,
        options: { gap, direction, curve },
      });

      if (!sceneInitResult) {
        initTimeoutRef.current = setTimeout(initSlider, 100);
        return;
      }

      const { planes } = sceneInitResult;
      planesRef.current = planes;

      // Функция проверки и загрузки текстур для видимых плоскостей
      const checkAndLoadVisibleTextures = () => {
        const scene = sceneRef.current;
        const cameraInstance = cameraRef.current;
        if (!scene || !cameraInstance || !textureLoaderRef.current) return;

        textureLoaderRef.current.checkAndLoadVisibleTextures(planes, cameraInstance, el);
      };

      // Проверяем видимость при первой инициализации
      checkAndLoadVisibleTextures();

      // Делаем начальный рендер сразу после инициализации
      renderer.render(scene, camera);

      // Создаем управление мышью
      const mouseControl = new MouseControl(el, scene, {
        gap,
        slideAmount,
        sensitivity: 0.01, // Чувствительность мыши
      });
      mouseControlRef.current = mouseControl;

      // Создаем и запускаем анимационный цикл (с паузой по умолчанию)
      const animationLoop = new AnimationLoop(
        scene,
        camera,
        renderer,
        { speed, gap, direction, slideAmount },
        {
          checkTextures: checkAndLoadVisibleTextures,
        }
      );

      animationLoopRef.current = animationLoop;
      // Запускаем с учетом опции autoPlay
      animationLoop.start(autoPlay);
    };

    // Запускаем инициализацию
    initSlider();

    // Cleanup
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = undefined;
      }

      if (animationLoopRef.current) {
        animationLoopRef.current.stop();
        animationLoopRef.current = undefined;
      }

      if (mouseControlRef.current) {
        mouseControlRef.current.dispose();
        mouseControlRef.current = undefined;
      }

      if (textureLoaderRef.current) {
        textureLoaderRef.current.dispose();
        textureLoaderRef.current = undefined;
      }

      if (rendererRef.current && containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          rendererRef.current.dispose();
          containerRef.current.removeChild(canvas);
        }
      }

      // Очищаем плоскости
      planesRef.current.forEach((plane) => {
        if (plane) {
          plane.geometry.dispose();
          if (plane.material instanceof THREE.Material) {
            (plane.material as THREE.ShaderMaterial).dispose();
          }
        }
      });
      planesRef.current = [];
    };
  }, [containerRef, images, options]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el || !cameraRef.current || !rendererRef.current) return;

      const { clientWidth, clientHeight } = el;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);
    // Дополнительный debounce
    const timeoutId = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [containerRef]);
};
