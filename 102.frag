#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

float random (in vec2 _uv) {
    return fract(sin(dot(_uv.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 _uv)
{
    vec2 i = floor(_uv);
    vec2 f = fract(_uv);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5
float fbm ( in vec2 _uv)
{
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_uv);
        _uv = rot * _uv * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main()
{

  // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec2 uv = gl_FragCoord.xy / resolution.xy * 3.;
  vec3 color = vec3(0.);

  vec2 q = vec2(0.);
  q.x = fbm(uv + .00 * time);
  q.y = fbm(uv + vec2(1.));

  vec2 r = vec2(0.);
  r.x = fbm(uv + 1. * q + vec2(1.7, 9.2) + .15  * time);
  r.y = fbm(uv + 1. * q + vec2(8.3, 2.8) + .126 * time);

  float f = fbm(uv + r);

  color = mix(vec3(.101961, .619608, .666667),
              vec3(.666667, .666667, .498039),
              clamp((f * f) * 4., 0., 1.));

  color = mix(color,
              vec3(0., 0., .164706),
              clamp(length(q), 0., 1.));

  color = mix(color,
              vec3(.666667,1,1),
              clamp(length(r.x), 0., 1.));

  gl_FragColor = vec4((f * f * f + .6 * f * f + .5 * f) * color, 1.);

}
