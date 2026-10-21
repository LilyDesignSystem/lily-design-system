import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<select><option class=\"option\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</option></select>";

const meta = {
  title: 'Headless/Option',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
