import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<pre
  class="code-block"
  aria-label=""
>
<code><!-- Consumer provides code --></code>
</pre>`;

const meta = {
  title: 'Headless/CodeBlock',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
