#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main() {

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float px = p.x + sin(time * 2.) * .5;
  float py = p.y + cos(time * 2.) * .5;

  float c = .1 / length(vec2(px, py));
        c = pow(c, 5.);

  vec3 dest = vec3(c);
  gl_FragColor = vec4(dest, 1.);
}
