import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"mockup-phone-landscape\" role=\"img\" aria-label=\"\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Phone Landscape',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
