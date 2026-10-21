import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CodeBlock component -->\n<!--\n  Description: a block of formatted code\n  HTML tag: <pre>\n  CSS class: code-block\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<pre\n  class=\"code-block\"\n  aria-label=\"\"\n>\n<code><!-- Consumer provides code --></code>\n</pre>";

const meta = {
  title: 'Headless/Code Block',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
