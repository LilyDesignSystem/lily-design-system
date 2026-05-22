import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<progress
  class="progress"  max="100"></progress>`;

const meta = {
  title: 'Headless/Progress',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
