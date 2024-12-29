"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { cn } from "@/lib/utils"

interface QuantumTunnelProps {
  isActive: boolean
  speed?: number
  colorStart?: string
  colorEnd?: string
}

const QuantumTunnel: React.FC<QuantumTunnelProps> = ({
  isActive,
  speed = 1,
  colorStart = "#60A5FA",
  colorEnd = "#A855F7",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tunnelRef = useRef<THREE.Mesh[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const currentContainer = containerRef.current
    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    currentContainer.appendChild(renderer.domElement)

    // Post-processing for bloom
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Bloom pass (tweak params as desired)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.25, // strength
      0.4, // radius
      0.85 // threshold
    )
    composer.addPass(bloomPass)

    // Adjust light & ambient so bloom is more visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.9)
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    // Create tunnel segments
    const segments = 15

    // We’ll adjust geometry to be less uniform
    // so the tunnel is a bit warped.
    const tunnelGeometry = new THREE.TorusGeometry(5, 0.8, 32, 64)

    // Let’s do a colorful, pulsating rainbow gradient.
    // We’ll mix in colorStart and colorEnd but also cycle hue over time.
    const tunnelMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorStart: { value: new THREE.Color(colorStart) },
        colorEnd: { value: new THREE.Color(colorEnd) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix 
            * modelViewMatrix 
            * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        varying vec2 vUv;

        // Simple hue rotation based on time
        vec3 hueShift(vec3 color, float shift) {
          const mat3 rgb2yiq = mat3(
            0.299,  0.587,  0.114,
            0.596, -0.275, -0.321,
            0.212, -0.523,  0.311
          );
          const mat3 yiq2rgb = mat3(
            1.0,  0.956,  0.621,
            1.0, -0.272, -0.647,
            1.0, -1.105,  1.702
          );
          vec3 yiq = rgb2yiq * color;
          float hue = atan(yiq.b, yiq.g) + shift;
          float chroma = sqrt(yiq.b * yiq.b + yiq.g * yiq.g);
          yiq.g = chroma * cos(hue);
          yiq.b = chroma * sin(hue);
          return clamp(yiq2rgb * yiq, 0.0, 1.0);
        }

        void main() {
          // We'll vary the mix factor by sin wave + uv
          float factor = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
          vec3 baseColor = mix(colorStart, colorEnd, factor);

          // Rotate hue over time so it cycles rainbow
          float hueRotation = time * 0.5; 
          vec3 shiftedColor = hueShift(baseColor, hueRotation);

          // We'll also add a subtle alpha pulsation
          float alpha = 0.6 + 0.4 * sin(time * 5.0);

          gl_FragColor = vec4(shiftedColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })

    // Instantiate the tunnel
    for (let i = 0; i < segments; i++) {
      const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial)
      tunnel.position.z = i * -2
      tunnel.rotation.y = Math.PI
      scene.add(tunnel)
      tunnelRef.current.push(tunnel)
    }

    // Adjust camera position for better view
    camera.position.z = 10
    camera.position.y = 0

    // Responsive resizing
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onWindowResize)

    // Create a large background sphere that surrounds everything
    const backgroundGeometry = new THREE.SphereGeometry(500, 32, 32)
    const backgroundMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorStart: { value: new THREE.Color("#1e1b4b") }, // indigo-950
        colorEnd: { value: new THREE.Color("#1e1e2d") },   // slate-950
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        varying vec2 vUv;

        void main() {
          // Create a moving gradient pattern
          float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
          vec3 color = mix(colorStart, colorEnd, noise);
          
          // Add some sparkle effect
          float sparkle = pow(sin(vUv.x * 50.0 + time) * sin(vUv.y * 50.0 + time), 5.0);
          color += vec3(sparkle * 0.3);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide // Render on the inside of the sphere
    })

    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
    scene.add(background)

    // Animation loop
    const animate = () => {
      if (!isActive) {
        // Reset camera position when deactivated
        camera.position.z = 10
        camera.position.y = 0
        return
      }

      frameRef.current = requestAnimationFrame(animate)
      const time = performance.now() * 0.001 * speed
      
      tunnelRef.current.forEach((tunnel, idx) => {
        // update uniform time
        ;(tunnel.material as THREE.ShaderMaterial).uniforms.time.value = time
        // Slight rotation on each ring
        tunnel.rotation.z = time * 0.2 + idx * 0.05
      })

      // Update background shader time
      ;(background.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.2

      // Calculate progress (0 to 1) over 5 seconds
      const progress = (time % 5) / 5
      
      // Move camera from z=10 to z=-20 over exactly 5 seconds
      camera.position.z = 10 - (progress * 30)
      // Add a gentle oscillation that doesn't affect the overall timing
      camera.position.z += Math.sin(time * 2) * 0.5

      // Render with bloom
      composer.render()
    }

    // Start animation
    animate()

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener("resize", onWindowResize)
      composer.dispose()
      renderer.dispose()
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement)
      }
    }
  }, [isActive, speed, colorStart, colorEnd])

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 pointer-events-none transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0"
      )}
    />
  )
}

export default QuantumTunnel