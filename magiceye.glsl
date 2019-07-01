#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(1233.1,311.7)),dot(p,vec2(219.5,143.3))))*43258.5253);
}

float noise(vec2 st)
{
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 0.;
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(8.211*point);
            vec2 diff = neighbor + point - f_st;
            float dist = smoothstep(0.,1.,length(diff));
            m_dist += (dist);
        }
    }
    st = gl_FragCoord.xy/resolution.xy;
    float cdist = smoothstep(0.1,0.9,length(st - vec2(0.5)))*5.;

    return (m_dist-6.3)/2.;
}

float circle(in vec2 _st, in float _radius, in vec2 center){
    vec2 dist = _st-center;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

// vec3 draw3D(in vec2 st, float shape, float height){
//     vec3 color = vec3(0.);
//     color += vec3(circle(st,0.1,vec2(0.25,0.5)));
// 	color += vec3(circle(st,0.1,vec2(0.77,0.5)));
//     return color;
// }

float brownianNoise(vec2 st){
    const int octaves = 3;
    float lacunarity = 2.1;
    float gain = 0.4;
    float amplitude = 0.5;
    float frequency = 1.;
	float y;

    for (int i = 0; i < octaves; i++) {
        y += amplitude * noise(frequency*st*4.);
        frequency *= lacunarity;
        amplitude *= gain;
    }
    return y;
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    vec3 color = vec3(.0);
    
    vec3 color1 = vec3(0.);
    vec3 color2 = vec3(1.);

    float div = 6.;
    
    
    vec2 i = floor(st/vec2(1./(div),1.));
    vec2 f = fract(st/vec2(1./(div),1.));

    st = f;
    
    
    //ADDS A SECOND IMAGE FOR DIRDS
    // float even = step(1.,mod(i.x,2.));
    // st = mod(st*vec2(2.*div,1.),1.) / vec2((div) , 1.) + (vec2(i.x-even,i.y))/(div*2.);
    
    // for (int i = 0; i < octaves; i++) {
    //     y += amplitude * noise(frequency*st*4.);
    //     frequency *= lacunarity;
    //     amplitude *= gain;
    // }
    
	float image = 0.;
    float height = 0.01;
    
    st = gl_FragCoord.xy/resolution.xy;
    
    image = step(0.5,circle(st,0.3,vec2(0.5+height,0.5)));
    color1 = vec3(sin(brownianNoise(f)*234.))+image;
    
    // ALTERNATING IMAGES USED FOR DIRDS
    // shift = circle(st,0.3,vec2(0.5-height,0.5));
    // color2 = vec3(sin(y*234.))+shift;
    // color = step(1.,mod(i.x,2.))*color2 + (1.-step(1.,mod(i.x,2.)))*color1;
	
    color = color1;
    gl_FragColor = vec4(color,1.0);
    
}