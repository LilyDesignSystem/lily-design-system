import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"flex-stack\"\n  data-direction=\"column\"\n  style=\"display: flex; flex-direction: column; gap: 1rem;\"\n>\n  <!-- Consumer provides stacked children -->\n</div>";

const meta = {
  title: 'Headless/Flex Stack',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
