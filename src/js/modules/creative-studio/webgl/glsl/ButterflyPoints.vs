attribute vec3 position;
attribute float number;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float interval;
uniform float numberAll;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  float thisTime = mod(time + number / numberAll * interval, interval);

  vec3 updatePosition = position + vec3(
    cos(thisTime * 1.0) * 3.0,
    thisTime * -4.0,
    sin(thisTime * 1.0) * 3.0
  );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);

  vec3 hsv = vec3(322.0 / 360.0, 0.8, 1.0);

  vColor = convertHsvToRgb(hsv);
  vOpacity = smoothstep(interval * 0.0, interval * 0.1, thisTime)
    * (1.0 - smoothstep(interval * 0.2, interval * 0.9, thisTime));

  gl_PointSize = 1600.0 / length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
