import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilySplitter(50, 'vertical')\">\n  <!-- Consumer provides the first pane -->\n  <div class=\"splitter\" aria-label=\"\" x-bind=\"separator\"></div>\n  <!-- Consumer provides the second pane -->\n</div>";

const meta = {
  title: 'Headless/Splitter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
