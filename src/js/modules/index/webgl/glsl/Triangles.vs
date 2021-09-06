attribute vec3 position;
attribute vec2 uv;
attribute vec3 iStartPosition;
attribute vec3 iEndPosition;
attribute vec3 iRotate;
attribute float iDuration;
attribute float iDelay;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);

void main(void) {
  // coordinate transformation
  float interval = mod(time + iDelay, iDuration) / iDuration;
  mat4 translateMat = calcTranslateMat4(mix(iStartPosition, iEndPosition, interval));
  mat4 rotateMat = calcRotateMat4(iRotate + vec3(0.0, time, 0.0));
  vec4 mPosition = modelMatrix * translateMat * rotateMat * vec4(position, 1.0);

  vPosition = mPosition.xyz;
  vUv = uv;
  vOpacity = smoothstep(0.0, 0.05, interval) * (1.0 - smoothstep(0.95, 1.0, interval));

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
