import { useState, useCallback, useRef } from 'react'
import { Box, Button, Typography } from '@mui/material'
import type { WheelSegment } from '../types/wheel.types'

interface AnimatedWheelPreviewProps {
  segments: WheelSegment[]
  size?: number
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

function pickRandomSegmentIndex(segments: WheelSegment[]): number {
  const random = Math.random() * 100
  let cumulative = 0
  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i].weight
    if (random <= cumulative) return i
  }
  return 0
}

export function AnimatedWheelPreview({ segments, size = 340 }: AnimatedWheelPreviewProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const baseRotationRef = useRef(0)

  const handleSpin = useCallback(() => {
    if (spinning || segments.length === 0) return

    setSpinning(true)
    setResult(null)

    const winnerIndex = pickRandomSegmentIndex(segments)
    const sliceAngle = 360 / segments.length
    const targetAngle = winnerIndex * sliceAngle + sliceAngle / 2
    const fullSpins = 5 + Math.floor(Math.random() * 3)
    const totalRotation = fullSpins * 360 + (360 - targetAngle)

    const newRotation = baseRotationRef.current + totalRotation
    setRotation(newRotation)
    baseRotationRef.current = newRotation

    setTimeout(() => {
      setSpinning(false)
      setResult(segments[winnerIndex].label)
    }, 4000)
  }, [spinning, segments])

  if (segments.length === 0) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '2px dashed',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">No segments</Typography>
      </Box>
    )
  }

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 16
  const labelR = r * 0.65

  const sliceAngle = 360 / segments.length

  const wedges = segments.map((seg, i) => {
    const startAngle = i * sliceAngle
    const endAngle = (i + 1) * sliceAngle
    const midAngle = (startAngle + endAngle) / 2
    return { seg, startAngle, endAngle, midAngle }
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        {/* Pointer triangle at top */}
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '20px solid #d32f2f',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : undefined,
          }}
        >
          <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#333" strokeWidth={3} />

          {wedges.map(({ seg, startAngle, endAngle, midAngle }) => {
            const path =
              segments.length === 1
                ? `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
                : describeArc(cx, cy, r, startAngle, endAngle)

            const textColor = getContrastColor(seg.color || '#607D8B')
            const arcSpan = endAngle - startAngle
            const arcRad = (arcSpan * Math.PI) / 180
            const availableWidth = arcRad * labelR * 0.8
            const labelFontSize = Math.max(7, Math.min(12, availableWidth / 5, size / 28))
            const weightFontSize = labelFontSize * 0.8
            const rotationAngle = midAngle - 90
            const maxChars = Math.max(3, Math.floor(availableWidth / (labelFontSize * 0.55)))
            const displayLabel =
              seg.label.length > maxChars ? seg.label.slice(0, maxChars - 1) + '…' : seg.label

            return (
              <g key={seg.id}>
                <path d={path} fill={seg.color || '#607D8B'} stroke="#fff" strokeWidth={2} />
                <g transform={`translate(${cx}, ${cy}) rotate(${rotationAngle})`}>
                  <text
                    x={labelR}
                    y={arcSpan > 20 ? -weightFontSize * 0.5 : 0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize={labelFontSize}
                    fontWeight={600}
                    fontFamily="sans-serif"
                  >
                    {displayLabel}
                  </text>
                  {arcSpan > 20 && (
                    <text
                      x={labelR}
                      y={labelFontSize * 0.7}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textColor}
                      fontSize={weightFontSize}
                      fontFamily="sans-serif"
                      opacity={0.8}
                    >
                      {seg.weight}%
                    </text>
                  )}
                </g>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={14} fill="#fff" stroke="#333" strokeWidth={2} />
        </svg>
      </Box>

      <Button
        variant="contained"
        color="error"
        onClick={handleSpin}
        disabled={spinning}
        sx={{ minWidth: 120 }}
      >
        {spinning ? 'Spinning...' : 'Spin!'}
      </Button>

      {result && (
        <Typography variant="h6" fontWeight={700} color="primary">
          {result}
        </Typography>
      )}
    </Box>
  )
}
