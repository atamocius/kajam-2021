import { useEffect } from 'react';

/**
 * @param {(ev: KeyboardEvent) => void} onKeyDown
 */
export function useKeyDownNoRepeat(onKeyDown) {
  useEffect(() => {
    let fired = false;

    const handleKeyDown = ev => {
      if (!fired) {
        fired = true;
        onKeyDown(ev);
      }
    };

    const handleKeyUp = () => (fired = false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown]);
}
