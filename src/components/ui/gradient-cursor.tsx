"use client"
import { useEffect, useState } from 'react'

export function GradientCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed pointer-events-none w-[250px] h-[250px] rounded-full blur-[100px] opacity-10 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-blue-400/50 transition-all duration-200 ease-out"
      style={{
        left: position.x - 125,
        top: position.y - 125,
      }}
    />
  )
} 