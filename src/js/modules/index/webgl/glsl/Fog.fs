precision highp float;

uniform float time;
uniform sampler2D normalMap;
uniform sampler2D surfaceTex;
uniform sampler2D fogTex;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // the pointyness color
  vec4 fog1 = texture2D(fogTex, vUv + vec2(0.0, time * -0.01));
  vec2 distortUv = vec2(
    (cos(radians(fog1.g * 360.0 + time * 10.0)) + cos(radians(fog1.b * 360.0 + time * 40.0))) * 0.05,
    (sin(radians(fog1.g * 360.0 + time * 10.0)) + sin(radians(fog1.b * 360.0 + time * 40.0))) * 0.05
    );
  vec4 fog2 = texture2D(fogTex, vUv + distortUv);

  vec3 rgb = vec3(190.0 / 255.0, 29.0 / 255.0, 130.0 / 255.0);
  vec3 color = rgb;

  float opacityX = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
  float opacityY = smoothstep(0.35, 0.5, vUv.y);
  float opacity = opacityX * opacityY * 0.35 * fog2.r;

  gl_FragColor = vec4(color, opacity);
}
