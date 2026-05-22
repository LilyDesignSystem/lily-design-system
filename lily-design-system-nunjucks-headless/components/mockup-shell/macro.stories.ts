import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="mockup-shell">
  <div class="mockup-shell-chrome" aria-hidden="true">  </div>
  <div class="mockup-shell-body"></div>
</figure>`;

const meta = {
  title: 'Headless/MockupShell',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
