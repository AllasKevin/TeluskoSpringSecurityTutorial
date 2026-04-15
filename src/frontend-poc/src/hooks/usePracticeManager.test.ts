import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePracticeManager } from './usePracticeManager';

const mockPlay = vi.fn().mockResolvedValue(undefined);

class MockAudio {
  src = '';
  play = mockPlay;
  constructor(src?: string) { this.src = src ?? ''; }
}

vi.stubGlobal('Audio', MockAudio);

describe('usePracticeManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null countdown initially', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() =>
      usePracticeManager({ duration: 10000, audioCues: [] }, onEnd),
    );

    expect(result.current).toBeNull();
  });

  it('calls onEnd after the duration expires', () => {
    const onEnd = vi.fn();
    renderHook(() =>
      usePracticeManager({ duration: 5000, audioCues: [] }, onEnd),
    );

    act(() => { vi.advanceTimersByTime(5000); });

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('triggers audio cues at scheduled times', () => {
    const onEnd = vi.fn();
    renderHook(() =>
      usePracticeManager({
        duration: 10000,
        audioCues: [
          { time: 1000, src: '/audio/test1.mp3' },
          { time: 3000, src: '/audio/test2.mp3' },
        ],
      }, onEnd),
    );

    act(() => { vi.advanceTimersByTime(1000); });
    expect(mockPlay).toHaveBeenCalledTimes(1);

    act(() => { vi.advanceTimersByTime(2000); });
    expect(mockPlay).toHaveBeenCalledTimes(2);
  });

  it('shows countdown during ending duration', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() =>
      usePracticeManager({
        duration: 5000,
        endingDuration: 3000,
        audioCues: [],
      }, onEnd),
    );

    // Before countdown starts (at 2000ms the ending countdown begins)
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toBeNull();

    // Countdown should be active after 2000ms (showing ~3 seconds)
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBeGreaterThan(0);
  });

  it('cleans up timers on unmount', () => {
    const onEnd = vi.fn();
    const { unmount } = renderHook(() =>
      usePracticeManager({ duration: 10000, audioCues: [] }, onEnd),
    );

    unmount();

    act(() => { vi.advanceTimersByTime(20000); });
    expect(onEnd).not.toHaveBeenCalled();
  });
});
