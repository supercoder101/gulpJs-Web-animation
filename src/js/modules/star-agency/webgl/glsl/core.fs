precision highp float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D textureNormal;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

const vec3 light = vec3(-1.0, 1.0, 0.5);

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec2 normal = texture2D(textureNormal, vUv + vec2(0.5, 0.0)).xy;
  vec2 updateUv = vUv + vec2(
    cos(radians(normal.x * 360.0 + time * 60.0)) * 0.006,
    sin(radians(normal.y * 360.0 + time * 60.0)) * 0.006
    );

  vec4 texColor = texture2D(texture, updateUv);
  vec3 hsv = vec3(
    (334.0 + texColor.r * 60.0) / 360.0,
    0.72 - texColor.r * 0.7,
    0.1 + dot(normalize(vPosition), normalize(light)) * 1.1
    );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
