import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"url-input\"\n  type=\"url\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Url Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
