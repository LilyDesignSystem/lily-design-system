import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="mockup-watch">
  <div class="mockup-watch-chrome" aria-hidden="true">  </div>
  <div class="mockup-watch-body"></div>
</figure>`;

const meta = {
  title: 'Headless/MockupWatch',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
