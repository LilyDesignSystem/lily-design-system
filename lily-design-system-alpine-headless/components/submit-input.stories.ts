import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"submit-input\"\n  type=\"submit\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Submit Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
