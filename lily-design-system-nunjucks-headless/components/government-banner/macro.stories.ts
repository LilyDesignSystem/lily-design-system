import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="government-banner">
  <header class="government-banner-header">    <button
      type="button"
      class="government-banner-toggle"
      aria-expanded="false"
      aria-controls="government-banner-details"
    ></button>
  </header>
  <div
    class="government-banner-details"
    id="government-banner-details" hidden  ></div>
</aside>`;

const meta = {
  title: 'Headless/GovernmentBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
