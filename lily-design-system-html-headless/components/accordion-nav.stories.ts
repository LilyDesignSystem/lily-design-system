import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="accordion-nav"
  aria-label=""
>
  <!-- Consumer provides navigation list -->
</nav>

<script>
  // AccordionNav behavior
  (function() {
    'use strict';
    // AccordionNav: consumer implements interactive behavior
    document.querySelectorAll('.accordion-nav').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/AccordionNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
