#ifdef GL_ES
precision mediump float;
#endif

// https://www.shadertoy.com/view/MstXWS

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main( void ) {

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float circle = 1.0 - length(p) * .5;
        circle = circle + cos(time * 2.);

  vec3 dest = vec3(p + circle, 1.0);

  gl_FragColor = vec4(dest, 1);

}
