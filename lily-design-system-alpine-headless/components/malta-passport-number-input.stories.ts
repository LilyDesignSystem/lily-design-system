import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"malta-passport-number-input\"\n  type=\"text\"\n  aria-label=\"Malta Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Malta Passport Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
