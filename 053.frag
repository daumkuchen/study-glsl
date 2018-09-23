#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in float x) { return fract(sin(x)*1e4); }
float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123);}

void main() {

  // vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 p = gl_FragCoord.xy / resolution.xy;
  p.x *= resolution.x / resolution.y;

  // grid
  float columns = 4.0;
  vec2 grid = vec2(resolution.x, columns);
  p *= grid;

  // integer
  vec2 ipos = floor(p);

  // time
  vec2 vel = floor(vec2(time * 10.0));
  // direction
  // vel *= vec2(-1.0, 0.0);
  // Oposite directions
  // vel *= (step(1.0, mod(ipos.y,2.0)) -0.5) * 2.0;
  // random speed
  // vel *= random(ipos.y);

  // 100%
  float totalCells = grid.x * grid.y;
  float t = mod((time * 1.0) * max(grid.x, grid.y) + floor(1.0 + (time * 1.0)), totalCells);

  // vec2 head = vec2((mod(t, grid.x) * grid.x), floor(t / grid.x));
  vec2 head = vec2(floor(t * grid.x), floor(t / grid.x));

  vec2 offset = vec2(0.0, 0.0);

  // color
  vec3 color = vec3(1.0);

  // y
  color *= step(grid.y - head.y, ipos.y);
  // x
  color += (1.0 - step(head.x, ipos.x)) * step(grid.y - head.y, ipos.y + 1.0);
  color = clamp(color,vec3(0.),vec3(1.));

  // Assign a random value base on the integer coord
  color.r *= random(floor(p + vel + offset));
  color.g *= random(floor(p + vel));
  color.b *= random(floor(p + vel - offset));

  // smooth
  color = smoothstep(0.0, 0.5, color * color);

  // threshold
  color = step(0.5, color);

  // Margin
  // color *= step(0.1, fract(p.x + vel.x)) * step(0.1, fract(p.y + vel.y));

  gl_FragColor = vec4(color * 0.1, 1.0);
}
