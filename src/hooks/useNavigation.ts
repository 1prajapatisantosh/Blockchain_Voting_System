import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

/**
 * Custom hook for handling navigation with improved back button support
 * This helps maintain consistent navigation behavior throughout the app
 */
export function useNavigation() {
  const navigate = useNavigate();

  /**
   * Navigate back in history, with a fallback route if no history is available
   * @param fallbackRoute - The route to navigate to if there's no history
   */
  const goBack = useCallback((fallbackRoute: string = '/') => {
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(fallbackRoute);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigate(fallbackRoute, { replace: true });
    }
  }, [navigate]);

  /**
   * Navigate to a specific route and replace current history entry
   * @param route - The route to navigate to
   */
  const navigateReplace = useCallback((route: string) => {
    try {
      navigate(route, { replace: true });
    } catch (error) {
      console.error('Navigation replace error:', error);
      // Fallback to direct page navigation
      window.location.href = route;
    }
  }, [navigate]);

  /**
   * Store the current path in session storage and navigate to a new route
   * @param route - The route to navigate to
   * @param storageKey - The key to use in session storage (default is 'lastVisitedPath')
   */
  const navigateWithMemory = useCallback((route: string, storageKey: string = 'lastVisitedPath') => {
    try {
      sessionStorage.setItem(storageKey, window.location.pathname);
      navigate(route);
    } catch (error) {
      console.error('Navigation with memory error:', error);
      navigate(route, { replace: true });
    }
  }, [navigate]);

  /**
   * Navigate back to the last stored path, or to a fallback if none exists
   * @param storageKey - The key to use in session storage (default is 'lastVisitedPath')
   * @param fallbackRoute - The route to navigate to if no stored path exists
   */
  const navigateToLastPath = useCallback((storageKey: string = 'lastVisitedPath', fallbackRoute: string = '/') => {
    try {
      const lastPath = sessionStorage.getItem(storageKey);
      navigate(lastPath || fallbackRoute);
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Navigation to last path error:', error);
      navigate(fallbackRoute, { replace: true });
    }
  }, [navigate]);

  // Handle page refresh/navigation errors
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Allow normal unload behavior but capture for analytics if needed
      return;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    navigate,
    goBack,
    navigateReplace,
    navigateWithMemory,
    navigateToLastPath
  };
}

export default useNavigation;
