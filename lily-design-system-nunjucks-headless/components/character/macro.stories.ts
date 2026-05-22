import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="character"></span>`;

const meta = {
  title: 'Headless/Character',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
