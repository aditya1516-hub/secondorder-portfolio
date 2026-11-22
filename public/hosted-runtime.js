(() => {
  if (typeof document !== 'undefined') {
    const research = document.createElement('script');
    research.src = './validation-client.js'; research.defer = true; document.head.append(research);
  }
  const originalFetch = window.fetch.bind(window);
  window.fetch = (resource, options = {}) => {
    const url = new URL(resource instanceof Request ? resource.url : resource, location.href);
    if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
      const headers = new Headers(resource instanceof Request ? resource.headers : undefined);
      new Headers(options.headers).forEach((value, name) => headers.set(name, value));
      const aiPage = /\/pm-interface-ai(?:\.html)?\/?$/i.test(location.pathname);
      if (aiPage || url.pathname === '/api/configure-key') headers.set('X-SecondOrder-Mode', 'ai');
      return originalFetch(resource, { ...options, headers });
    }
    return originalFetch(resource, options);
  };
})();
