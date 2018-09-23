#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

//rhombic triacontahedron
//incomplete study of internal polyhedra
//sphinx

#define VIEW_POSITION vec3(-5., 0., -25.)
#define MAX_FLOAT (pow(2., 128.)-1.)
#define TAU (8. * atan(1.))
#define PHI ((sqrt(5.)+1.)*.5)
#define PHI2 (PHI*PHI)
#define PHI3 (PHI*PHI*PHI)
#define SLICE (mouse.x * resolution.x < gl_FragCoord.x);

//pow(dot(pow(v, v*0.+m), v*0.+1.), 1./m)

vec3 g_color = vec3(1., 2., 1.);

vec3 e_color = vec3(1., 1., 1.);
vec3 f_color = vec3(1., 1., 1.);
vec3 v_color = vec3(1., 1., 1.);

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

vec3 hsv(in float h, in float s, in float v)
{
  return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float dot2(in vec3 v)
{
	return dot(v,v);
}

float sum(in vec3 v)
{
	return dot(v, vec3(1., 1., 1.));
}

float cube(vec3 p, vec3 s)
{
	vec3 d = abs(p) - s;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float segment(vec3 p, vec3 a, vec3 b, float r)
{
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);

	return length(pa - ba * h)-r;
}

float edge(vec3 p, vec3 a, vec3 b)
{
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	return length(pa - ba * h);
}

float rhombictriacontahedron(vec3 p, float r)
{
	//face normals
	vec3 q = vec3(.30901699437, .5,.80901699437);
	p	= abs(p);
	return  max(max(max(max(max(max(p.x, p.y), p.z), dot(p.zxy, q)), dot(p.xyz, q)), dot(p.yzx, q)) - r, 0.);
}

float udQuad( vec3 p, vec3 a, vec3 b, vec3 c, vec3 d )
{
    vec3 ba = b - a; vec3 pa = p - a;
    vec3 cb = c - b; vec3 pb = p - b;
    vec3 dc = d - c; vec3 pc = p - c;
    vec3 ad = a - d; vec3 pd = p - d;
    vec3 nor = cross( ba, ad );

    return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(dc,nor),pc)) +
     sign(dot(cross(ad,nor),pd))<3.0)
     ?
     min( min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(dc*clamp(dot(dc,pc)/dot2(dc),0.0,1.0)-pc) ),
     dot2(ad*clamp(dot(ad,pd)/dot2(ad),0.0,1.0)-pd) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
}

float rtc_edges(vec3 position, float scale)
{
	position = abs(position);

	vec4 v = vec4(PHI3, PHI2, PHI, 0.) * scale;

	float e[9];
	e[0] = edge(position, v.xyw, v.yyy);
	e[1] = edge(position, v.wxy, v.yyy);
	e[2] = edge(position, v.ywx, v.yyy);
	e[3] = edge(position, v.xyw, v.xwz);
	e[4] = edge(position, v.xyw, v.zxw);
	e[5] = edge(position, v.ywx, v.wzx);
	e[6] = edge(position, v.ywx, v.xwz);
	e[7] = edge(position, v.wxy, v.wzx);
	e[8] = edge(position, v.wxy, v.zxw);

	float edges	= MAX_FLOAT;
 	for(int i = 0; i < 9; i++)
	{
		edges = min(edges, e[i]);
	}

	return edges;
}


float rtc_embedding(vec3 position, float scale, float radius)
{
	vec3 origin = position;

	vec4 v = vec4(PHI3, PHI2, PHI, 0.);

	float edges = rtc_edges(position, scale);

	return abs(edges);
}

float rtc_faces(vec3 position, float scale, float depth)
{
	position	= abs(position);

	vec4 v = vec4(PHI3, PHI2, PHI, 0.) * scale;

	float fa = udQuad(position, v.yyy, v.xyw, v.xwz, v.ywx);
	float fb = udQuad(position, v.yyy, v.ywx, v.wzx, v.wxy);
	float fc = udQuad(position, v.yyy, v.wxy, v.zxw, v.xyw);
	float fd = udQuad(position, v.xwz, v.xyw, v.xyw, v.xwz * vec3(1., 1., -1.));
	float fe = udQuad(position, v.wzx, v.ywx, v.ywx, v.ywx * vec3(-1., 1., 1.));
	float ff = udQuad(position, v.wxy, v.zxw, v.zxw, v.zxw * vec3(-1., 1., 1.));
	float faces 	= min(min(min(min(min(fa, fb), fc), fd), fe), ff);

	f_color = fb == faces ? vec3(0., 1., 0.) : f_color;
	f_color = fc == faces ? vec3(1., 0., 1.) : f_color;
	f_color = fa == faces ? vec3(1., 0., 0.) : f_color;
	f_color = fd == faces ? vec3(1., 1., 0.) : f_color;
	f_color = fe == faces ? vec3(0., 1., 1.) : f_color;
	f_color = ff == faces ? vec3(0., 0., 1.) : f_color;

	return faces - depth;
}

float rtc_vertices(vec3 position, float scale, float radius)
{
	position	= abs(position);

	vec4 v = vec4(PHI3, PHI2, PHI, 0.) * scale;

	float va = length(position-v.yyy); //center
	float vb = length(position-v.xyw); //right
	float vc = length(position-v.xwz); //bottom right
	float vd = length(position-v.ywx); //bottom center
	float ve = length(position-v.wzx); //left
	float vf = length(position-v.wxy); //top left
	float vg = length(position-v.zxw); //top right
	float verts	= min(min(min(min(min(min(va, vb), vc), vd), ve), vf), vg);

	v_color = va == verts ? vec3(1., 0., 0.) : v_color;
	v_color = vb == verts ? vec3(1., 0., 1.) : v_color;
	v_color = vc == verts ? vec3(1., 1., 0.) : v_color;
	v_color = vd == verts ? vec3(0., 1., 0.) : v_color;
	v_color = ve == verts ? vec3(0., 1., 1.) : v_color;
	v_color = vf == verts ? vec3(0., 0., 1.) : v_color;
	v_color = vg == verts ? vec3(1., 1., 1.) : v_color;

	g_color 	= v_color;

	return verts - radius;
}

vec3 position_origin(vec3 p)
{
	p	= p;
	if(mouse.y < .25)
	{
		p.zy *= rmat(mouse.y*TAU*4.-TAU*.5);
		p.xz *= rmat(mouse.x*TAU+TAU/2.);
	}
	else
	{
		p.xz *= rmat(time * .0625);
		p.yz *= rmat(time * .0625);
	}
	return p;
}

float bound(vec3 p, float scale)
{
	return cube(p, vec3(scale));
}

void init_map(in vec3 position, out vec3 origin, out float range, out float scale, out float radius, out float bounds)
{
	range = MAX_FLOAT;

	origin = position_origin(position);

	scale = 1.;

	radius = .01;
	position.xz *= rmat(.4);
	bounds = bound(position, scale);
}

float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}

float max_component(vec3 v)
{
	return max(max(v.x, v.y), v.z);
}

float map(vec3 position)
{
	vec3 origin;
	float range, scale, radius, bounds;
	init_map(position, origin, range, scale, radius, bounds);

	vec4 phi_basis	= vec4(PHI3, PHI2, PHI, 0.); //this is the shared basis vector set
	vec4 v = 1./phi_basis;

	const int basis_count = 12;

	vec3 basis[basis_count];

	// from wiki : It contains ten tetrahedra, five cubes, an icosahedron and a dodecahedron. The centers of the faces contain five octahedra.
	vec3 p = origin;
	vec3 o = abs(p);

  //// regular faces (all sides are the same polygon - able to swap faces = transitive = symmetries)

	//// cube ////
	basis[0]	= o.xyz;
	////	////	////

	//// dodecahedron ////
	basis[1]	= o.xyz*v.zzz + o.yzx*v.yyy;
	basis[2]	= o.xyz*v.zzz + o.zxy*v.yyy;

	//rhombic thing
	basis[3]	= o.xyz*v.zzz + o.yzx*v.zzz;

  //// multiple shapes on the faces

	//2 unique faces
 	basis[4]	= o.yxz*v.zzy + o.xyz*v.yyz; //8, 4 (octagon)
 	basis[4]	= o.yzx*v.yyz*PHI + o.zyx*v.xxz; //8, 4 (octagon) (also hax! - only exploring this simple way of making the basis - anything goes otherwise...)

	// 3 faces
	basis[5]	= o.xzy*v.zzz + o.yxz*v.yyz; //5, 5, 4
	basis[6]	= o.zyx*v.yzy + o.yxz*v.zzz; //5, 5, 4
	basis[7]	= o.zyz*v.zzz + o.xxy*v.zxz;
	basis[8]	= o.xyz*v.yzx + o.yzx*v.zzz; //5, 5, 4
	basis[9]	= o.xyx*v.zzz + o.zzx*v.zzz; //6, 5, 3
	basis[10]	= o.xzy*v.zyz + o.zzy*v.yzy; //6, 4, 4
	basis[11]	= o.xyz*v.zzz + o.xxy*v.yzy; //6, 5, 4

	float t 	= mouse.y < .25 ? mouse.x : time / 2.;
	t = mod(t * float(basis_count), float(basis_count));
	int u = int(t);

	float a = 0.;
	float b = 0.;
	float c = 0.;
	for(int i = 0; i < basis_count; i++)
	{
		if(i == u)
		{
			a = max_component(basis[int(mod(float(i-1), float(basis_count)))]);
			b = max_component(basis[int(mod(float(i), float(basis_count)))]);
			c = max_component(basis[int(mod(float(i+1), float(basis_count)))]);
		}
	}

	range		= mix(a, b, fract(t));
	// range 		= max_component(basis[11]);

	range -= PHI2;

	float embedding = rtc_embedding(origin, scale, radius)-.0125;

	range = min(range, embedding);

	g_color = range == embedding ? vec3(1., 1., 1.) : hsv(t/8., 1., .5) * 2.;
	return range-.0;
}

vec3 derive(in vec3 position, in float range)
{
	vec2 offset = vec2(0., range);
	vec3 normal = vec3(0.);
	normal.x = map(position+offset.yxx)-map(position-offset.yxx);
	normal.y = map(position+offset.xyx)-map(position-offset.xyx);
	normal.z = map(position+offset.xxy)-map(position-offset.xxy);
	return normalize(normal);
}

float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k)
{
	float sh = 1.0;
	float t = mint;
	float h = 0.0;
	for (int i = 0; i < 32; i++)
	{
		if (t > maxt)
			continue;
			h = map(origin + direction * t);
			sh = smoothmin(sh, k * h/t, 8.0);
			t += clamp( h, 0.01, 0.5 );
	}
	return clamp(sh, 0., 1.);
}

float ambient_occlusion(vec3 position, vec3 normal)
{
	float delta 	= 0.125;
	float occlusion = 0.0;
	float t 	= .2;
	for (float i = 1.; i <= 9.; i++)
	{
	  occlusion	+= t * (i * delta - map(position + normal * delta * i));
	  t *= .5;
	}
	const float k 	= 4.0;
	return 1.0 - clamp(k * occlusion, 0., 1.);
}


void main( void )
{
	vec2 aspect = resolution.xy / resolution.yy;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = (uv - .5) * aspect;

	vec2 m = (mouse-.5) * aspect;

	vec3 direction = normalize(vec3(uv, PHI));
	vec3 origin = VIEW_POSITION;
	vec3 position = origin;

	//raytrace
	float minimum_range	= 8./max(resolution.x, resolution.y);
	float max_range = 32.;
	float range = max_range;
	float total_range = 18.;
	float steps = 0.;

	vec3 background_color = (vec3(.375, .375, .5) - uv.y) * .8625;
	vec3 light_color = vec3( .9, .85, .73)*1.2;

	vec3 color = background_color;

	float origional_range	= range;

	for(int count = 1; count < 64; count++)
	{
		if(range > minimum_range && total_range < max_range)
		{
			steps++;

			range = min(map(position), 1.5);
			range *= .95;
			minimum_range	*= 1.04;

			total_range += range;

			position = origin + direction * total_range;
		}
	}

	origional_range = total_range;
	color += clamp(.0225/pow(total_range/steps, 2.), 0., 1.);

	if(steps < 63. && total_range < max_range)
	{
		vec3 surface_direction = derive(position, minimum_range);

		vec3 light_position = VIEW_POSITION+vec3(-80., 90., -42.);
		vec3 light_direction = normalize(light_position - position);

		float light		= max(dot(surface_direction, light_direction), -.1);

		vec3 reflection = reflect(direction, surface_direction);
		float specular = pow(clamp(dot(reflection, light_direction), 0.0, 1.0), 8.0);
		float bounce = pow(clamp(dot(light_direction, reflect(-direction, surface_direction)), 0.0, 1.0), 4.0);

		color = vec3(.54, .4, .35) * g_color * light_color;
		color *= clamp(abs(total_range/steps)/8., 0., 1.)*.25+.3;
		color = color + color + light * .9 + color * specular * 3.2 + bounce * 1.5;

		color *= ambient_occlusion(position, surface_direction) * .15 + .8;
		color *= .875 + .125 * shadow(position, light_direction, 0., 512., 64.);
	}

	color = pow(color * .91, vec3(1.6, 1.6, 1.6));

	gl_FragColor = vec4(color, 1.);
}
