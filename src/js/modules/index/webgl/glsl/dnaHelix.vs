attribute vec3 position;
attribute float radian;
attribute float radius;
attribute float delay;
attribute float isInside;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float pixelRatio;

varying vec4 vColor;
varying float vIsInside;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  // coordinate transformation
  float noiseX = cnoise3(vec3(position.zy * 0.08, time * 0.3));
  float noiseY = cnoise3(vec3(position.yz * 0.18, time * 0.3));
  vec3 updatePosition = position + vec3(
    noiseX * 8.0,
    noiseY * (6.0 + abs(position.x / 140.0) * 20.0),
    0.0
    );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);
  float pointSize = 1000.0 / distanceFromCamera * (isInside * 1.6 + (1.0 - isInside) * 1.2) * pixelRatio;

  vColor = vec4(
    169.0 / 255.0, 25.0 / 255.0, 115.0 / 255.0,
    smoothstep(0.1, 0.5, abs(updatePosition.x / 140.0)) * updatePosition.z / 40.0
    );
  vIsInside = isInside;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
