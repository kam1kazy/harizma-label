import * as THREE from 'three';

/**
 * Vertex shader для создания кривизны слайдов
 */
export const CURVED_VERTEX_SHADER = `
  uniform float curve;
  varying vec2 vertexUV;
  void main() {
    vertexUV = uv;
    vec3 newPosition = position;
    float distanceFromCenter = abs(modelMatrix * vec4(position, 1.0)).x;
    newPosition.y *= 1.0 + (curve / 100.0) * pow(distanceFromCenter, 2.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

/**
 * Fragment shader для отображения текстуры
 */
export const CURVED_FRAGMENT_SHADER = `
  uniform sampler2D tex;
  varying vec2 vertexUV;
  void main() {
    gl_FragColor = texture2D(tex, vertexUV);
  }
`;

/**
 * Создает shader материал для слайда с заданной текстурой и кривизной
 */
export function createShaderMaterial(
  texture: THREE.Texture,
  curve: number
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tex: { value: texture },
      curve: { value: curve },
    },
    vertexShader: CURVED_VERTEX_SHADER,
    fragmentShader: CURVED_FRAGMENT_SHADER,
  });
}

/**
 * Создает placeholder текстуру (серый квадрат 1x1 для видимости)
 */
function createPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#333333'; // Светло-серый для видимости на темном фоне
    ctx.fillRect(0, 0, 1, 1);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * Создает placeholder материал для слайда (используется до загрузки текстуры)
 */
export function createPlaceholderMaterial(curve: number): THREE.ShaderMaterial {
  const placeholderTexture = createPlaceholderTexture();
  return createShaderMaterial(placeholderTexture, curve);
}

