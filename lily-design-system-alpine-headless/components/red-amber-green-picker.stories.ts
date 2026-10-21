import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<select class=\"red-amber-green-picker\" aria-label=\"\" x-data=\"{ value: 'red' }\" x-model=\"value\" :data-value=\"value\">\n  <option value=\"red\"><!-- Consumer provides label --></option>\n  <option value=\"amber\"><!-- Consumer provides label --></option>\n  <option value=\"green\"><!-- Consumer provides label --></option>\n</select>";

const meta = {
  title: 'Headless/Red Amber Green Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
