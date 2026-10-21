import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"affix\"\n  style=\"position: sticky; top: 0;\"\n  data-offset-top=\"0\"\n>\n  <!-- Consumer provides the content to be pinned to the viewport -->\n</div>";

const meta = {
  title: 'Headless/Affix',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
