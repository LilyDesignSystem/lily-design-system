import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="splitter"
  role="separator"
  aria-orientation="vertical"  tabindex="0"></div>`;

const meta = {
  title: 'Headless/Splitter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
