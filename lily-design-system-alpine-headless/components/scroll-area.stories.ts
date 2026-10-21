import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"scroll-area\" role=\"region\" tabindex=\"0\" aria-label=\"\">\n  <!-- Consumer provides content; consumer CSS sets the overflow and size -->\n</div>";

const meta = {
  title: 'Headless/Scroll Area',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
