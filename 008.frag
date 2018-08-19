#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 truchetPattern(in vec2 _st, in float _index){
  _index = fract(((_index-0.5)*2.0));
  if (_index > 0.75) {
      _st = vec2(1.0) - _st;
  } else if (_index > 0.5) {
      _st = vec2(1.0-_st.x,_st.y);
  } else if (_index > 0.25) {
      _st = 1.0-vec2(1.0-_st.x,_st.y);
  }
  return _st;
}

void main(void){

  vec2 st = gl_FragCoord.xy/resolution.xy;
       st *= 10.0;

    // integer
    vec2 ipos = floor(st);

    // fraction
    vec2 fpos = fract(st);

    vec2 tile = truchetPattern(fpos, random(ipos));

    float color = 0.5;

    // Maze
    color = smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y) * tan(time / 120.0 * 110.0);

    // Circles
    // color = (step(length(tile),0.6) -
    //          step(length(tile),0.4) ) +
    //         (step(length(tile-vec2(1.)),0.6) -
    //          step(length(tile-vec2(1.)),0.4) );

    // Truchet (2 triangles)
    // color = step(tile.x,tile.y + sin(time * 2.0));

    gl_FragColor = vec4(vec3(color),1.0);
}
