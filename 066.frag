#ifdef GL_ES
precision mediump float;
#endif

// https://www.shadertoy.com/view/MstXWS

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main( void ) {

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy);
       p /= min(resolution.x, resolution.y);

  float px = p.x + sin(time * 0.);
  float py = p.y + cos(time * 0.);

  float c1 = length(px * py);

  float c2 = fract(px * py);

  // float c2 = length(1.0) * .5;
  //       c2 = c2 + sin(time * 2.);

  vec3 dest = vec3(p + c1 + c2, 1.) * .7;

  gl_FragColor = vec4(dest, 1);

}
