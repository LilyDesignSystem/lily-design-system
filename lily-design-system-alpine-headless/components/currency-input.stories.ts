import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input class=\"currency-input\" aria-label=\"\" x-data=\"lilyCurrencyInput('GBP', 0, 100)\" x-bind=\"input\">";

const meta = {
  title: 'Headless/Currency Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
