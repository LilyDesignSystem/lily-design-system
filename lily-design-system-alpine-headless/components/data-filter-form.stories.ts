import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<form class=\"data-filter-form\" role=\"search\" aria-label=\"\" x-data=\"lilyDataFilterForm()\" x-bind=\"form\">\n  <!-- Consumer provides form fields -->\n  <input name=\"q\" aria-label=\"\">\n  <button type=\"submit\"><!-- Consumer provides apply label --></button>\n  <button type=\"reset\"><!-- Consumer provides reset label --></button>\n</form>";

const meta = {
  title: 'Headless/Data Filter Form',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
