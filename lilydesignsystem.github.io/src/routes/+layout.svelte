<script lang="ts">
  import { page } from '$app/state';

  let { children } = $props();

  type NavLink = { href: string; label: string };
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/why/', label: 'Why Lily' },
    { href: '/components/', label: 'Components' },
    { href: '/tutorials/', label: 'Tutorials' },
    { href: '/examples/', label: 'Examples' },
    { href: '/help/', label: 'Help' },
    { href: '/about/', label: 'About' }
  ];

  function isCurrent(href: string): boolean {
    return page.url.pathname === href;
  }
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href="/" aria-label="Lily Design System home">
      <img
        class="site-brand-mark"
        src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
        alt=""
        aria-hidden="true"
      />
      <span>Lily Design System™</span>
    </a>
    <nav class="site-nav" aria-label="Main">
      {#each navLinks as link}
        <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
          {link.label}
        </a>
      {/each}
      <a href="https://github.com/LilyDesignSystem">GitHub</a>
    </nav>
  </div>
</header>

<main id="main" class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <p>© Lily Design System. Free open source — BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0.</p>
    <p class="site-footer-trademark">Lily™ and Lily Design System™ are trademarks.</p>
    <div class="site-footer-links">
      <a href="https://github.com/LilyDesignSystem">GitHub</a>
      <a href="/why/">Why Lily</a>
      <a href="/tutorials/">Tutorials</a>
      <a href="/help/">Help</a>
      <a href="/about/">About</a>
    </div>
  </div>
</footer>
