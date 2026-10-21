import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"split-view\"\n  aria-label=\"\"\n  data-orientation=\"horizontal\"\n  data-split-percent=\"50\"\n>\n  <section class=\"split-view-primary\">\n    <!-- Consumer provides primary panel content -->\n  </section>\n\n  <div\n    class=\"split-view-divider\"\n    role=\"separator\"\n    aria-orientation=\"horizontal\"\n    aria-valuenow=\"50\"\n    aria-valuemin=\"0\"\n    aria-valuemax=\"100\"\n    tabindex=\"0\"\n  ></div>\n\n  <section class=\"split-view-secondary\">\n    <!-- Consumer provides secondary panel content -->\n  </section>\n</div>";

const meta = {
  title: 'Headless/Split View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
