import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="screen-reader-span"></span>`;

const meta = {
  title: 'Headless/ScreenReaderSpan',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
