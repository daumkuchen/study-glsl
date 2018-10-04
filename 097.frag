#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define occlusion_enabled
#define occlusion_quality 4
// #define occlusion_preview

#define noise_use_smoothstep

#define light_color vec3(0.1,0.4,0.6)
#define light_direction normalize(vec3(.2,1.0,-0.2))
#define light_speed_modifier 1.0

#define object_color vec3(0.9,0.1,0.1)
#define object_count 9
#define object_speed_modifier 1.0

#define render_steps 33

float hash(float x)
{
	return fract(sin(x*.0127863)*17143.321);
}

float hash(vec2 x)
{
	return fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0);
}

// a wierd color modifier
vec3 cc(vec3 color, float factor,float factor2)
{
	float w = color.x+color.y+color.z;
	return mix(color,vec3(w)*factor,w*factor2);
}

float hashmix(float x0, float x1, float interp)
{
	x0 = hash(x0);
	x1 = hash(x1);
	#ifdef noise_use_smoothstep
	interp = smoothstep(0.0,1.0,interp);
	#endif
	return mix(x0,x1,interp);
}

// 1D noise
float noise(float p)
{
	float pm = mod(p,1.0);
	float pd = p-pm;
	return hashmix(pd,pd+1.0,pm);
}

vec3 rotate_y(vec3 v, float angle)
{
	float ca = cos(angle); float sa = sin(angle);
	return v*mat3(
		+ca, +.0, -sa,
		+.0,+1.0, +.0,
		+sa, +.0, +ca
  );
}

vec3 rotate_x(vec3 v, float angle)
{
	float ca = cos(angle); float sa = sin(angle);
	return v*mat3(
		+1.0, +.0, +.0,
		+.0, +ca, -sa,
		+.0, +sa, +ca
  );
}

//returns the maximum of 3 values
float max3(float a, float b, float c)
{
	return max(a,max(b,c));
}

//position for each metaball
vec3 bpos[object_count];

//distance function
float dist(vec3 p)
{
	float d=1024.0;
	float nd;
	for (int i=0 ;i<object_count; i++)
	{
		vec3 np = p+bpos[i];
		float shape0 = max3(abs(np.x),abs(np.y),abs(np.z))-1.0;
		float shape1 = length(np)-1.0;
		nd = shape0+(shape1-shape0)*2.0;
		d = mix(d,nd,smoothstep(-1.0,+1.0,d-nd));
	}
	return d;
}

//returns the normal, uses the distance function
vec3 normal(vec3 p,float e)
{
	float d=dist(p);
	return normalize(vec3(dist(p+vec3(e,0,0))-d,dist(p+vec3(0,e,0))-d,dist(p+vec3(0,0,e))-d));
}

//global variable that holds light direction
vec3 light = light_direction;

//render background
vec3 background(vec3 d)
{
	float t=time*0.5*light_speed_modifier;
	float qq = dot(d,light)*.5+.5;
	float bgl = qq;
	float q = (bgl+noise(bgl*6.0+t)*.85+noise(bgl*12.0+t)*.85);
	q+= pow(qq,32.0)*2.0;
	vec3 sky = vec3(0.1,0.4,0.6)*q;
	return sky;
}

//returns how much a point is visible from a given direction
float occlusion(vec3 p, vec3 d)
{
	float occ = 1.0;
	p=p+d;
	for (int i=0; i<occlusion_quality; i++)
	{
		float dd = dist(p);
		p+=d*dd;
		occ = min(occ,dd);
	}
	return max(.0,occ);
}

vec3 object_material(vec3 p, vec3 d)
{
	vec3 color = normalize(object_color*light_color);
	vec3 n = normal(p,0.1);
	vec3 r = reflect(d,n);

	float reflectance = dot(d,r)*.5+.5;reflectance=pow(reflectance,2.0);
	float diffuse = dot(light,n)*.5+.5; diffuse = max(.0,diffuse);

	#ifdef occlusion_enabled
		float oa = occlusion(p,n)*.4+.6;
		float od = occlusion(p,light)*.95+.05;
		float os = occlusion(p,r)*.95+.05;
	#else
		float oa=1.0;
		float ob=1.0;
		float oc=1.0;
	#endif

	#ifndef occlusion_preview
		color =
		color*oa*.2 + //ambient
		color*diffuse*od*.7 + //diffuse
		background(r)*os*reflectance*.7; //reflection
	#else
		color=vec3((oa+od+os)*.3);
	#endif

	return color;
}

#define offset1 4.7
#define offset2 4.6

void main()
{
	vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	// vec3 m = vec3(mouse.xy / resolution.xy - 0.5, mouse.z-.5);

  vec3 m = vec3(mouse.xy / resolution.xy - .5, 1.);

	float t = time*.5*object_speed_modifier + 2.0;

  //position for each metaball
	for (int i=0 ;i<object_count; i++)
	{
		bpos[i] = 1.3*vec3(
			sin(t*0.967+float(i)*42.0),
			sin(t*.423+float(i)*152.0),
			sin(t*.76321+float(i)));
	}

	//setup the camera
	vec3 p = vec3(.0,0.0,-4.0);
	p = rotate_x(p,m.y*9.0+offset1);
	p = rotate_y(p,m.x*9.0+offset2);
	vec3 d = vec3(uv,1.0);
	d.z -= length(d)*.5; //lens distort
	d = normalize(d);
	d = rotate_x(d,m.y*9.0+offset1);
  d = rotate_y(d,m.x*9.0+offset2);

	// and action!
	float dd;
	vec3 color;

  // raymarch
	for (int i=0; i<render_steps; i++)
	{
		dd = dist(p);
		p+=d*dd*.7;
		if (dd<.04 || dd>4.0) break;
	}

  //#requireclose enough
	if (dd<0.5)
		color = object_material(p,d);
	else
		color = background(d);

	// post procesing
	color *=.85;
	color = mix(color,color*color,0.3);
	color -= hash(color.xy+uv.xy)*.015;
	color -= length(uv)*.1;
	color =cc(color,.5,.6);
	gl_FragColor = vec4(color,1.0);

}
