import { useEffect, useRef, useState } from 'react'

// Animate the photographic cutout as a textured mesh. Local deformation keeps
// the feet planted while the upper bodies, joined hands and skirt move together.
const vertexSource = `
  attribute vec2 a_uv;
  uniform float u_time;
  uniform vec2 u_fit;
  varying vec2 v_uv;

  float region(vec2 uv, vec2 center, vec2 radius) {
    vec2 d = (uv - center) / radius;
    return exp(-dot(d, d) * 2.0);
  }

  void main() {
    v_uv = a_uv;
    vec2 p = a_uv;
    float beat = u_time * 0.92;
    float sway = sin(beat);
    float upper = 1.0 - smoothstep(0.42, 0.79, a_uv.y);
    float planted = 1.0 - smoothstep(0.81, 0.995, a_uv.y);

    // Shared shoulder frame turns gently about the waist on each waltz beat.
    vec2 pivot = vec2(0.64, 0.51);
    vec2 relative = (p - pivot) * vec2(0.774, 1.0);
    float angle = sway * 0.044;
    float c = cos(angle);
    float s = sin(angle);
    vec2 turned = mat2(c, -s, s, c) * relative;
    p += (turned - relative) / vec2(0.774, 1.0) * upper;
    p.x += sway * 0.035 * planted;
    p.y -= (1.0 - cos(beat * 2.0)) * 0.005 * planted;

    // Joined hands trace a small arc, with a soft falloff through the elbows.
    float hands = region(a_uv, vec2(0.30, 0.26), vec2(0.26, 0.15));
    p.x += sin(beat + 0.45) * 0.022 * hands;
    p.y -= sin(beat + 0.45) * 0.029 * hands;

    // A restrained inward lean keeps both faces intact and close together.
    float brideHead = region(a_uv, vec2(0.58, 0.15), vec2(0.12, 0.13));
    float groomHead = region(a_uv, vec2(0.72, 0.09), vec2(0.12, 0.12));
    p.x += sin(beat * 0.5) * 0.005 * (brideHead - groomHead);
    p.y += sin(beat + 0.2) * 0.004 * brideHead;

    // Satin follows the turn a fraction of a beat after the torso.
    float skirt = smoothstep(0.41, 0.67, a_uv.y) * (1.0 - smoothstep(0.55, 0.76, a_uv.x));
    float hem = 1.0 - smoothstep(0.94, 1.0, a_uv.y);
    p.x += sin(beat - 0.65 + a_uv.y * 1.4) * 0.026 * skirt;
    p.y += sin(beat - 0.8 + a_uv.x * 3.0) * 0.008 * skirt * hem;
    float knee = region(a_uv, vec2(0.79, 0.77), vec2(0.10, 0.17));
    p.x += sin(beat + 0.25) * 0.01 * knee;

    gl_Position = vec4((p.x - 0.5) * 2.0 * u_fit.x,
                       (0.5 - p.y) * 2.0 * u_fit.y, 0.0, 1.0);
  }
`

const fragmentSource = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_uv;
  void main() { gl_FragColor = texture2D(u_image, v_uv); }
`

export default function DancingCouple({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pausedRef = useRef(paused)
  const [rendered, setRendered] = useState(false)

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true })
    if (!gl) return
    let disposed = false
    let frame = 0
    let time = 0
    let lastTime = 0
    let imageAspect = 0.774
    const shaders: WebGLShader[] = []
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null
      return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertex || !fragment) {
      shaders.forEach(shader => gl.deleteShader(shader))
      return
    }
    const program = gl.createProgram()!
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteProgram(program)
      return
    }
    gl.useProgram(program)
    const columns = 64
    const rows = 84
    const vertices: number[] = []
    const indices: number[] = []
    for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
      vertices.push(col / columns, row / rows)
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col
        const b = a + columns + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
    const vertexBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    const uv = gl.getAttribLocation(program, 'a_uv')
    gl.enableVertexAttribArray(uv)
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0)
    const timeUniform = gl.getUniformLocation(program, 'u_time')
    const fitUniform = gl.getUniformLocation(program, 'u_fit')
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const ratio = Math.min(window.devicePixelRatio, 2)
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
      gl.viewport(0, 0, canvas.width, canvas.height)
      const aspect = rect.width / rect.height
      gl.uniform2f(fitUniform, Math.min(1, imageAspect / aspect) * 0.93, Math.min(1, aspect / imageAspect) * 0.93)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const image = new Image()
    image.onload = () => {
      if (disposed) return
      imageAspect = image.naturalWidth / image.naturalHeight
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      resize()
      const render = (now: number) => {
        if (disposed) return
        const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0
        lastTime = now
        if (!pausedRef.current && !document.hidden) time += delta
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(timeUniform, time)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        canvas.dataset.danceTime = time.toFixed(3)
        frame = requestAnimationFrame(render)
      }
      render(performance.now())
      setRendered(true)
    }
    image.src = '/images/dancing-couple.png'
    const lost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      setRendered(false)
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => {
      disposed = true
      image.onload = null
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', lost)
      gl.deleteTexture(texture)
      gl.deleteBuffer(vertexBuffer)
      gl.deleteBuffer(indexBuffer)
      gl.deleteProgram(program)
      shaders.forEach(shader => gl.deleteShader(shader))
    }
  }, [])

  return <div className={`couple-performer ${rendered ? 'is-rendered' : ''}`}>
    <img src="/images/dancing-couple.png" className="dancing-couple" alt="" />
    <canvas ref={canvasRef} className="dance-renderer" aria-hidden="true" />
  </div>
}
