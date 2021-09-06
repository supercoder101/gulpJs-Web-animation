precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = dot(normal, light) * 0.3;

  vec3 color = vec3(0.6) + diff;

  gl_FragColor = vec4(color, vOpacity);
}
