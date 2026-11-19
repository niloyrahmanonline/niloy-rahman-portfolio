// Estimate the display cadence from the lower quartile so missed frames do not lower the target.
const MIN_INTERVAL = 4;
const BUCKET = .5;
const WINDOW = 1500;

export function createOrbitQualityMonitor() {
  const intervals = new Uint16Array(160);
  let sampleTime = 0;
  let count = 0;
  let slowWindows = 0;

  function resetWindow() {
    intervals.fill(0);
    sampleTime = 0;
    count = 0;
  }

  return {
    reset() {
      resetWindow();
      slowWindows = 0;
    },
    sample(milliseconds: number) {
      if (milliseconds < MIN_INTERVAL || milliseconds > 250) return false;
      intervals[Math.min(intervals.length - 1, Math.round(milliseconds / BUCKET))]++;
      sampleTime += milliseconds;
      count++;
      if (sampleTime < WINDOW) return false;

      let seen = 0;
      const quartile = Math.ceil(count / 4);
      let cadence = 0;
      while (seen < quartile) seen += intervals[cadence++];
      const lateStart = Math.ceil((cadence - 1) * 1.5);
      let late = 0;
      for (let i = lateStart; i < intervals.length; i++) late += intervals[i];
      slowWindows = late / count >= .20 ? slowWindows + 1 : 0;
      resetWindow();
      return slowWindows >= 2;
    },
  };
}