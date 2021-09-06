precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcRotateMat3 = require(glsl-matrix/calcRotateMat3);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec2 rotateUv = (calcRotateMat3(time * 0.04) * vec3(p, 1.0)).xy * 0.5 + 0.5;
  vec4 texColor = texture2D(texture, rotateUv);

  float l = length(vPosition);
  vec2 rotateMask = (calcRotateMat3(time * -0.02) * vec3(p, 1.0)).xy;
  float opacityIn = pow(1.0 - smoothstep(6.0, 11.0, l), 2.0);
  float opacityOut = 1.0 - smoothstep(8.0, 24.0, l);
  float opacityRay = sin(acos(dot(normalize(rotateMask), vec2(1.0, 0.0))) * 2.4 + time) * 0.4 + 0.6;
  float opacity = opacityIn * 0.6 + opacityOut * 0.3 + opacityRay * texColor.r;

  vec3 hsv = vec3(
    329.0 / 360.0 + opacity * 0.12,
    0.76 - opacity * 0.2,
    opacity * 0.2 + 0.8
    );

  float opacityGlow = (1.0 - smoothstep(6.0, 9.0, l));
  vec3 hsv2 = vec3(
    329.0 / 360.0,
    0.76,
    opacityGlow
    );
  vec3 rgb = convertHsvToRgb(hsv) + convertHsvToRgb(hsv2);

  gl_FragColor = vec4(rgb, opacity);
}
