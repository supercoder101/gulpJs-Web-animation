precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  vec4 texColor = texture2D(texture, vUv);

  float noise = snoise3(vPosition * 0.05 + vec3(0.0, 0.0, time));
  vec3 hsv = vec3(322.0 / 360.0 + noise * 0.1, 0.91, 0.66);
  vec3 rgb = convertHsvToRgb(hsv) * (texColor.g - texColor.r);

  if (texColor.g < 0.5) discard;

  gl_FragColor = vec4(rgb, texColor.g * vOpacity);
}
