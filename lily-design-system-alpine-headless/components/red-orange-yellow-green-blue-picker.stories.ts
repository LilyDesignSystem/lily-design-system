import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<select class=\"red-orange-yellow-green-blue-picker\" aria-label=\"\" x-data=\"{ value: 'red' }\" x-model=\"value\" :data-value=\"value\">\n  <option value=\"red\"><!-- Consumer provides label --></option>\n  <option value=\"orange\"><!-- Consumer provides label --></option>\n  <option value=\"yellow\"><!-- Consumer provides label --></option>\n  <option value=\"green\"><!-- Consumer provides label --></option>\n  <option value=\"blue\"><!-- Consumer provides label --></option>\n</select>";

const meta = {
  title: 'Headless/Red Orange Yellow Green Blue Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
