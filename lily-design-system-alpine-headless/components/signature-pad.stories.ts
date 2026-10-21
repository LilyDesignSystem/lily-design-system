import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"signature-pad\" role=\"application\" aria-label=\"\">\n  <!-- Consumer provides the drawing surface (canvas, SVG, …) -->\n</div>";

const meta = {
  title: 'Headless/Signature Pad',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
