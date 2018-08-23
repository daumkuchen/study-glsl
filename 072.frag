#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float num = 10.;

void main(void){

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  //
  // 01
  // // float x = uv.x + sin(time * 2.) * .5;
  // // float y = uv.y + cos(time * 2.) * .5;
  // float x = uv.x;
  // float y = uv.y;
  // float color = .1 / length(vec2(x, y));

  //
  // 02
  float color = 0.;

  for(float i = 0.; i < num; i++)
  {

    // float ii = i + 1.0;
    // float x = uv.x * 2. + sin(time * ii);
    // float y = uv.y * 2. + cos(time * ii);
    // color += .1 / length(vec2(x, y));

    for(float j = 0.; j < num; j++)
    {

      float ii = i + 1.;
      float jj = j + 1.;

      float x = uv.x + ii * .2 - 1.1;
      float y = uv.y + jj * .2 - 1.1;

      color += .1 / length(vec2(x, y)) * .02;

    }
  }

  // for(float i = 0.; i < 10.; i++)
  // {
  //   float j = i + 1.;
  //   vec2 q = uv + vec2(cos(time * j), sin(time * j)) * 0.5;
  //   color += 0.05 / length(q);
  // }

  vec3 dest = vec3(color);
  gl_FragColor = vec4(dest, 1.);


}
