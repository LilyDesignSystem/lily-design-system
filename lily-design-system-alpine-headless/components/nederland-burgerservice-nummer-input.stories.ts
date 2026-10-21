import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"nederland-burgerservice-nummer-input\"\n  type=\"text\"\n  aria-label=\"Citizen Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Burgerservice Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
