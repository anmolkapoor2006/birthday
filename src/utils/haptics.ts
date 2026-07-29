/**
 * Triggers light, tactile haptic vibration feedback on mobile & supported browsers.
 * Safe fallback for desktop or unsupported devices.
 */
export function triggerHapticFeedback(pattern: number | number[] = 15) {
  if (typeof window === 'undefined') return;
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
}
