import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"bulgaria-edinen-grazhdanski-nomer-view\"\n  aria-label=\"Uniform Civil Number\"\n></span>";

const meta = {
  title: 'Headless/Bulgaria Edinen Grazhdanski Nomer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
