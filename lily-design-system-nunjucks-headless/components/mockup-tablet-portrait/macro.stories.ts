import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="mockup-tablet-portrait">
  <div class="mockup-tablet-portrait-chrome" aria-hidden="true">  </div>
  <div class="mockup-tablet-portrait-body"></div>
</figure>`;

const meta = {
  title: 'Headless/MockupTabletPortrait',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
