import { Box, Typography } from '@mui/material'
import type { WheelSegment } from '../types/wheel.types'

interface WheelPreviewProps {
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

export function WheelPreview({ segments, size = 300 }: WheelPreviewProps) {
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
  const r = size / 2 - 4
  const labelR = r * 0.65

  const cumulativeWeights = segments.reduce<number[]>(
    (acc, seg, i) => [...acc, (acc[i - 1] ?? 0) + seg.weight],
    [],
  )

  const wedges = segments.map((seg, i) => {
    const startAngle = (((cumulativeWeights[i - 1] ?? 0)) / 100) * 360
    const endAngle = (cumulativeWeights[i] / 100) * 360
    const midAngle = (startAngle + endAngle) / 2
    return { seg, startAngle, endAngle, midAngle }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#333" strokeWidth={3} />

      {wedges.map(({ seg, startAngle, endAngle, midAngle }) => {
        const path =
          segments.length === 1
            ? `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
            : describeArc(cx, cy, r, startAngle, endAngle)

        const labelPos = polarToCartesian(cx, cy, labelR, midAngle - 90)
        const textColor = getContrastColor(seg.color || '#607D8B')

        return (
          <g key={seg.id}>
            <path d={path} fill={seg.color || '#607D8B'} stroke="#fff" strokeWidth={1} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textColor}
              fontSize={Math.max(9, Math.min(12, size / 28))}
              fontWeight={600}
              fontFamily="sans-serif"
            >
              {seg.label}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textColor}
              fontSize={Math.max(8, Math.min(10, size / 34))}
              fontFamily="sans-serif"
              opacity={0.8}
            >
              {seg.weight}%
            </text>
          </g>
        )
      })}

      <circle cx={cx} cy={cy} r={12} fill="#fff" stroke="#333" strokeWidth={2} />
    </svg>
  )
}
