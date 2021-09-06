precision highp float;

uniform sampler2D texture;
uniform float opacity;
uniform float time;

varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  vec4 texColor = texture2D(texture, vUv);

  float noise1 = cnoise3(vec3(vUv * vec2(30.0, 4.0), time * -0.36)) * 0.5 + 0.5;
  float noise2 = cnoise3(vec3(vUv * vec2(200.0, 1.0), time * 0.6)) * 0.5 + 0.5;
  float noise = noise1 * 0.8 + noise2 * 0.2 + texColor.a * 0.3;

  vec3 hsv = vec3(0.94 - noise * noise * 0.07, 1.0, 0.4 + noise * noise * 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, texColor.a * noise * opacity);
}
