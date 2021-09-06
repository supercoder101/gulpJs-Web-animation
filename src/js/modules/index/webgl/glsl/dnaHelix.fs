precision highp float;

varying vec4 vColor;
varying float vIsInside;

void main() {
  // Convert PointCoord to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // Draw circle
  float radius = length(p);
  float opacity = smoothstep(0.5, 0.7, radius) * (1.0 - smoothstep(1.0, 1.2, radius));

  gl_FragColor = vec4(vColor.rgb, (opacity * vIsInside + (1.0 - vIsInside)) * vColor.a);
}
