import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="emoji" role="img" aria-label=""></span>`;

const meta = {
  title: 'Headless/Emoji',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
