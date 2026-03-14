import React from 'react';

interface SpinnerProps {
  size?: number;
  fullScreen?: boolean;
}

export function Spinner({ size = 20, fullScreen = false }: SpinnerProps) {
  const spinner = (
    <div className="spinner" style={{ width: size, height: size }} />
  );

  if (fullScreen) {
    return (
      <div className="page-spinner">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingCenter({ size = 36 }: { size?: number }) {
  return (
    <div className="loading-center">
      <Spinner size={size} />
    </div>
  );
}
