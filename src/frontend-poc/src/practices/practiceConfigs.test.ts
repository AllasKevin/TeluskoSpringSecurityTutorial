import { describe, it, expect } from 'vitest';
import { practiceConfigs } from './practiceConfigs';

describe('practiceConfigs', () => {
  it('contains all expected practice types', () => {
    expect(practiceConfigs).toHaveProperty('askingpractice');
    expect(practiceConfigs).toHaveProperty('noticinggame');
    expect(practiceConfigs).toHaveProperty('ifspartssharing');
  });

  Object.entries(practiceConfigs).forEach(([name, config]) => {
    describe(name, () => {
      it('has a positive duration', () => {
        expect(config.duration).toBeGreaterThan(0);
      });

      it('has endingDuration less than or equal to duration', () => {
        expect(config.endingDuration).toBeLessThanOrEqual(config.duration);
      });

      it('has at least one audio cue', () => {
        expect(config.audioCues.length).toBeGreaterThanOrEqual(1);
      });

      it('has audio cues with valid time and src', () => {
        config.audioCues.forEach((cue) => {
          expect(cue.time).toBeGreaterThanOrEqual(0);
          expect(cue.time).toBeLessThanOrEqual(config.duration);
          expect(cue.src).toMatch(/^\/audio\/.+\.mp3$/);
        });
      });

      it('has audio cues sorted by time in ascending order', () => {
        for (let i = 1; i < config.audioCues.length; i++) {
          expect(config.audioCues[i].time).toBeGreaterThanOrEqual(
            config.audioCues[i - 1].time
          );
        }
      });
    });
  });
});
