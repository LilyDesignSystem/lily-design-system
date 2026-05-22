import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="sticky-promo-banner"
  role="complementary"
  data-position="bottom"
  style="position: fixed; left: 0; right: 0; bottom: 0;">
  <div class="sticky-promo-banner-content"></div></aside>`;

const meta = {
  title: 'Headless/StickyPromoBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
