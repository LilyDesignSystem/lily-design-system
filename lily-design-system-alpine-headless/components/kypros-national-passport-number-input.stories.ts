import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"kypros-national-passport-number-input\"\n  type=\"text\"\n  aria-label=\"National Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Kypros National Passport Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
