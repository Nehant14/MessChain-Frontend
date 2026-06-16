export function countdownToText(value: number): string {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
