import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="flair"></span>`;

const meta = {
  title: 'Headless/Flair',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
