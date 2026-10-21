import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<aside class=\"sticky-promo-banner\" role=\"complementary\" aria-label=\"\" data-position=\"bottom\"\n       x-data=\"lilyDismissible(true)\" x-bind=\"root\">\n  <div class=\"sticky-promo-banner-content\">\n    <!-- Consumer provides banner content -->\n  </div>\n  <button class=\"sticky-promo-banner-dismiss\" x-bind=\"dismiss\" aria-label=\"\"><!-- Consumer provides label --></button>\n</aside>";

const meta = {
  title: 'Headless/Sticky Promo Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
