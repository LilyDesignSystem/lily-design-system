import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"slovenija-emso-input\"\n  type=\"text\"\n  aria-label=\"Unique Master Citizen Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovenija Emso Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
