import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="mockup-tablet-landscape">
  <div class="mockup-tablet-landscape-chrome" aria-hidden="true">  </div>
  <div class="mockup-tablet-landscape-body"></div>
</figure>`;

const meta = {
  title: 'Headless/MockupTabletLandscape',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
