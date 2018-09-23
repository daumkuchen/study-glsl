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
       // p /= min(resolution.x, resolution.y);

  float trans = sin(time * 2.) + cos(time * 2.);

  vec3 color = vec3(p, p.y) * p.x * .0001;

  vec3 dest = vec3(color * trans);

  gl_FragColor = vec4(dest, 1);

}
