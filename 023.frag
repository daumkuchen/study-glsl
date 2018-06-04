#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){

  vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float ellipse = 1.0 / length(vec2(position.x, position.y));
        ellipse = float(ellipse);

  float rect = 1.0 / length(vec2(position.x, position.y) * 2.0);
        rect = floor(rect);




  vec3 color = vec3(rect);

  gl_FragColor = vec4(color, 0);

}
