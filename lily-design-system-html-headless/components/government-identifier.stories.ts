import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="government-identifier"
  aria-label=""
>
  <div class="government-identifier-masthead">
    <!-- Optional logo:
         <img class="government-identifier-logo" src="" alt=""> -->
    <p class="government-identifier-agency">
      <!-- When agencyHref is provided, wrap agencyName in <a href="…">…</a>;
           otherwise wrap in <span>…</span>. -->
    </p>
    <!-- Optional description:
         <p class="government-identifier-description"></p> -->
  </div>

  <nav
    class="government-identifier-links"
    aria-label=""
  >
    <!-- Consumer provides the required links list (typically a <ul> of <li><a></a></li>) -->
  </nav>
</section>`;

const meta = {
  title: 'Headless/GovernmentIdentifier',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
