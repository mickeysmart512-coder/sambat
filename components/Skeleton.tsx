'use client';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', margin = '0' }: SkeletonProps) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      margin,
      background: 'linear-gradient(90deg, #121212 25%, #1a1a1a 50%, #121212 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite linear',
    }}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
