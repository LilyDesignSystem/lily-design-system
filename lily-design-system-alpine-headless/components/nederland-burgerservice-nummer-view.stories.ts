import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"nederland-burgerservice-nummer-view\"\n  aria-label=\"Citizen Service Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Burgerservice Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
