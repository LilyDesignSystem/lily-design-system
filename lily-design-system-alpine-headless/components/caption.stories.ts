import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><caption class=\"caption\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</caption></table>";

const meta = {
  title: 'Headless/Caption',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
