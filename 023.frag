#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main()
{

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // pale
    // for(float i = 1.0; i < 3.0; i++){
    //   p.x += 0.3 / i * sin(i * 3.0 * p.y + time * 0.1 + cos((time / (100. * i)) * i));
    //   p.y += 0.4 / i * cos(i * 3.0 * p.x + time * 2.1 + sin((time / (200. * i)) * i));
    // }
    // float r = cos(p.x + p.y + 2.) * .5 + .5;
    // float g = sin(p.x + p.y + 1.) * .5 + .5;
    // float b = r + g * 2.0;

    // hard
    for(float i = 1.0; i < 10.0; i++){
      p.x += 0.3 / i * sin(i * 3.0 * p.y + (time * 0.1) + cos((time / (10.0 * i)) * i));
      p.y += 0.4 / i * cos(i * 3.0 * p.x + (time * 0.5) + sin((time / (20.0 * i)) * i));
    }
    float r = cos(p.x + p.y + 2.0) * 0.5 + 0.5;
    float g = sin(p.x + p.y + 1.0) * 0.5 + 0.5;
    float b = r + g * 2.0;

    vec3 color = vec3(r, g, b);

    gl_FragColor = vec4(color, 1);
}
