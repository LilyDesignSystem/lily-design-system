import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<main\n  class=\"grail-layout-center-main\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</main>";

const meta = {
  title: 'Headless/Grail Layout Center Main',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
