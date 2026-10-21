import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"malta-national-identification-number-input\"\n  type=\"text\"\n  aria-label=\"Malta National Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Malta National Identification Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
