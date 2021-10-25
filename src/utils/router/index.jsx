import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
} from 'react';

export const RouterContext = createContext();

export function Route({ name, visible, children }) {
  return visible ? children : null;
}

export function RouterProvider({ children }) {
  const [currentRoute, changeRoute] = useState(null);
  const [childRoutes, setChildRoutes] = useState(children);

  useEffect(() => {
    const routes = Children.map(children, (child, i) => {
      if (!isValidElement(child) || child.type.name !== 'Route') {
        return child;
      }

      // Default to the first route in the list at the start
      if (currentRoute === null && i === 0) {
        return cloneElement(child, { visible: true });
      }

      if (child.props.name === currentRoute) {
        return cloneElement(child, { visible: true });
      }

      return cloneElement(child, { visible: false });
    });

    setChildRoutes(routes);
  }, [currentRoute]);

  const value = { changeRoute };

  return (
    <RouterContext.Provider value={value}>{childRoutes}</RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);

  if (ctx === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }

  return ctx;
}
