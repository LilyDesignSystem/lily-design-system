import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"slider-button\"\n  role=\"slider\"\n  aria-label=\"\"\n  type=\"button\"\n  aria-valuemin=\"0\"\n  aria-valuemax=\"100\"\n  aria-valuenow=\"0\"\n>\n  <!-- Consumer provides content -->\n</button>";

const meta = {
  title: 'Headless/Slider Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
