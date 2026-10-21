import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"show-more\" x-data=\"lilyShowMore(false)\" x-bind=\"root\">\n  <div class=\"show-more-content\" id=\"show-more-content-1\" x-bind=\"content\">\n    <!-- Consumer provides long content; CSS clamps it while data-expanded is false -->\n  </div>\n  <button class=\"show-more-button\" x-bind=\"button\" aria-controls=\"show-more-content-1\">\n    <!-- Consumer provides the label, e.g. via x-text=\"expanded ? lessLabel : moreLabel\" -->\n  </button>\n</div>";

const meta = {
  title: 'Headless/Show More',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
