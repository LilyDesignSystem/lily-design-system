import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"container-with-fluid-width\"\n  data-padding-inline=\"1rem\"\n  style=\"width: 100%; padding-inline: 1rem;\"\n>\n  <!-- Consumer provides fluid-width content -->\n</div>";

const meta = {
  title: 'Headless/Container With Fluid Width',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
