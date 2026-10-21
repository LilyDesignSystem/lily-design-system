import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"united-kingdom-national-insurance-number-input\"\n  type=\"text\"\n  aria-label=\"National Insurance Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/United Kingdom National Insurance Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
