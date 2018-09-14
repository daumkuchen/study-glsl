#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){

  // vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  //
  // float posX = p.x + sin(time * 2.0) * 0.5;
  // float posY = p.y + cos(time * 2.0) * 0.5;
  //
  // float orb = 0.1 / length(vec2(posX, posY));
  //
  // gl_FragColor = vec4(vec3(orb), 1.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float px = cos(time * 2.0);
  float py = sin(time * 6.0);
  vec2 pos = vec2(px, py) * 0.5;

  vec2 uv = vec2(gl_FragCoord.xy / resolution);

  if(distance(p, pos) < 0.2){
    gl_FragColor = vec4(0.1 / length(pos * uv));
  } else {
    gl_FragColor = texture2D(backbuffer, uv) * .9;
  }

}
