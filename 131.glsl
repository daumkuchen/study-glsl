void mainImage(out vec4 fragColor, in vec2 p) {

  vec4 s = .07 * cos(1.5 * vec4(0, 1, 2, 3) + iTime + p.y + sin(p.y) * cos(iTime));
  // vec4 s = .075 * cos(1.5 * vec4(0., 1., 2., 3.) + p.y + sin(p.y));
  vec4 e = s.yzwx;
  vec4 f = max(p.x - s, e - p.x);

  vec4 col = dot(clamp(f * iResolution.y, 0., 1.), 75. * (s - e)) * (s - .1) + f;
  vec3 rgb = vec3(col.r + col.g + col.b) / 3.;
  fragColor = vec4(rgb, 1.);

}

void main(){

  // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);

  vec2 p = gl_FragCoord.xy - iResolution.xy / 2.;
  p = vec2(length(p) / iResolution.y - .3, atan(p.x, p.y));

  vec4 col;
  mainImage(col, p);
  gl_FragColor = col;

}