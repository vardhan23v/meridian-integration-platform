'use client';

import type { JSX } from 'react';
import type { PipelineStatus } from '@meridian/shared';
import PipelineCard from './PipelineCard';

interface PipelineStatusListProps {
  pipelines: PipelineStatus[];
}

const DELAY_CLASSES = [
  'delay-100',
  'delay-200',
  'delay-300',
  'delay-400',
  'delay-500',
];

export default function PipelineStatusList({
  pipelines,
}: PipelineStatusListProps): JSX.Element {
  if (pipelines.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No pipelines configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
        Pipeline Status
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline, index) => (
          <PipelineCard
            key={pipeline.id}
            pipeline={pipeline}
            delayClass={DELAY_CLASSES[index % DELAY_CLASSES.length] ?? ''}
          />
        ))}
      </div>
    </div>
  );
}