varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uPerlin;
uniform float delta;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec4 colorMap = texture2D(uPerlin, vTextureCoord);

    if (color.a != 0.0){
        if(colorMap.r > delta) color.a = 0.0;
        
        color.r *= color.a;
        color.g *= color.a;
        color.b *= color.a;
    }

    gl_FragColor = color;
}