import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"container-with-fixed-width\"\n  data-max-width=\"1200px\"\n  style=\"max-width: 1200px; margin-inline: auto;\"\n>\n  <!-- Consumer provides centered content -->\n</div>";

const meta = {
  title: 'Headless/Container With Fixed Width',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
