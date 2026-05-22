import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="super-banner"
  role="alert"
  data-level="warning"></div>`;

const meta = {
  title: 'Headless/SuperBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
