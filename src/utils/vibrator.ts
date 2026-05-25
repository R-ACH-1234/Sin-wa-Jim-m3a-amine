/**
 * Utility for triggering haptic feedback / vibration on mobile devices
 * 
 * Supports short double tap for correct answers, a heavier warning buzz for wrong answers,
 * and a very brief tap for light micro-interactions.
 */
export const hapticFeedback = {
  /**
   * Short pleasant double vibration for correct answers (light-felt feedback)
   */
  vibrateCorrect: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate([65, 45, 65]);
      } catch (err) {
        // Ignored under security or platform sandbox constraints
      }
    }
  },

  /**
   * Distinct warning double-beat vibration for wrong answers or timeout occurrences
   */
  vibrateWrong: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate([180, 80, 180]);
      } catch (err) {
        // Ignored
      }
    }
  },

  /**
   * Micro haptic tap for standard taps & subtle feedback
   */
  vibrateLight: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(30);
      } catch (err) {
        // Ignored
      }
    }
  }
};
