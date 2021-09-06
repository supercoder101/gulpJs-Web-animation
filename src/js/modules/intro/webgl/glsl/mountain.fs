precision highp float;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float time;
uniform float opacity;
uniform float darkFilter;

varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  float mask = texture2D(texture2, vUv).a;
  float noise = cnoise3(vec3(vUv * vec2(160.0, 380.0 + time * 0.8), time * 0.6));
  vec2 updateUv = (vUv + vec2(noise * vec2(0.02, 0.01)));

  vec4 texColor1 = texture2D(texture1, vUv) * (1.0 - mask);
  vec4 texColor2 = texture2D(texture1, updateUv) * mask;
  vec4 texColor = texColor1 + texColor2;

  gl_FragColor = texColor * vec4(vec3(1.0 - darkFilter * 0.3), opacity);
}
