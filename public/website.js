(() => {
  const research = document.createElement('script');
  research.src = './validation-client.js'; research.defer = true; document.head.append(research);
  // Keep previously shared overview anchors useful after separating the pages.
  const legacyAnchors = ['#experience', '#before-you-play', '#modes'];
  if (/(?:\/index\.html|\/)$/i.test(location.pathname) && legacyAnchors.includes(location.hash)) {
    location.replace(`./experience.html${location.hash}`);
    return;
  }
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('siteNav');
  function closeMenu() {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    nav?.classList.remove('is-open');
  }
  menuButton?.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', opened);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const examples = {
    service: ['Invest in customer service', 'Higher costs put pressure on margins.', 'Better service can rebuild trust and repeat demand.', 'Can the business fund the investment long enough to see the benefit?'],
    pricing: ['Cut prices to grow sales', 'Demand may rise, while profit per sale falls.', 'Repeated discounts can weaken pricing power and train customers to wait.', 'Is the extra volume worth the margin loss and future pricing pressure?'],
  };
  document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
    const values = examples[button.dataset.demo];
    document.querySelectorAll('[data-demo]').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    ['demoMove', 'demoImmediate', 'demoDelayed', 'demoQuestion'].forEach((id, index) => { document.getElementById(id).textContent = values[index]; });
  }));

  function wireTabs(selector, activate) {
    const tabs = Array.from(document.querySelectorAll(selector));
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab, tabs));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault(); tabs[next].focus(); activate(tabs[next], tabs);
      });
    });
  }
  function select(tab, tabs) {
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
  }
  wireTabs('[data-room]', (tab, tabs) => {
    select(tab, tabs);
    document.querySelectorAll('.room-panel').forEach(panel => { panel.hidden = panel.id !== `room-${tab.dataset.room}`; });
  });

  const reasoning = [
    ['“Because I felt like doing so.”', 'THE GAP: NO BUSINESS JUSTIFICATION', 'The explanation does not connect the choice to a goal, a constraint or any evidence. The selected option alone cannot demonstrate understanding.', 'What problem does pausing this segment solve, and what might it cost?'],
    ['“The segment was using too many resources.”', 'RELEVANT, BUT THE TRADE-OFF NEEDS DETAIL', 'This gives a plausible direction, but does not establish which resources are constrained, whether the segment is profitable, or what the business gives up by pausing it.', 'Which evidence supports the resource concern, and how does that compare with the segment’s contribution?'],
    ['“I would compare the segment’s contribution margin and resource demands with alternatives before pausing it. I’d also check the effect on customers and brand, and set a trigger to reconsider.”', 'A CLEARER CHAIN OF REASONING', 'This explanation names the relevant evidence, considers opportunity cost and stakeholder effects, and describes how the decision could be revisited. Actual data would still be needed to justify the choice.', 'What measurable threshold would tell you to restart, redesign or exit the segment?'],
  ];
  wireTabs('[data-reason]', (tab, tabs) => {
    select(tab, tabs);
    const values = reasoning[Number(tab.dataset.reason)];
    ['reasonQuote', 'reasonLabel', 'reasonFeedback', 'reasonNext'].forEach((id, index) => { document.getElementById(id).textContent = values[index]; });
    document.getElementById('reasonExample').setAttribute('aria-labelledby', tab.id);
  });

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
  }
})();
