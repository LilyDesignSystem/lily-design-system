import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"super-banner\"\n  role=\"alert\"\n  aria-label=\"\"\n  aria-live=\"assertive\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Super Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
