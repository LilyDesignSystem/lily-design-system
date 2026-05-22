import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="mockup-window">
  <div class="mockup-window-chrome" aria-hidden="true">  </div>
  <div class="mockup-window-body"></div>
</figure>`;

const meta = {
  title: 'Headless/MockupWindow',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
