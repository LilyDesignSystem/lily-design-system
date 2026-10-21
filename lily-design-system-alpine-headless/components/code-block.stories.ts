import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<pre\n  class=\"code-block\"\n  aria-label=\"\"\n>\n<code><!-- Consumer provides code --></code>\n</pre>";

const meta = {
  title: 'Headless/Code Block',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
