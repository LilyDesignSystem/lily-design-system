import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"scroller\"\n  aria-label=\"\"\n  data-offset=\"0.5\"\n>\n  <div class=\"scroller-background\" aria-live=\"polite\">\n    <!-- Consumer provides sticky background -->\n  </div>\n  <div class=\"scroller-foreground scroller-base\" data-offset=\"0.5\">\n    <!-- Consumer provides step children -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Scroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
