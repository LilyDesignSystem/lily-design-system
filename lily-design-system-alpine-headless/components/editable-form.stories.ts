import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyEditableForm()\">\n  <button class=\"editable-form-edit\" x-bind=\"editButton\"><!-- Consumer provides edit label --></button>\n  <form class=\"editable-form\" aria-label=\"\" hidden x-bind=\"form\">\n    <input name=\"title\" aria-label=\"\">\n    <button type=\"submit\"><!-- Consumer provides save label --></button>\n  </form>\n</div>";

const meta = {
  title: 'Headless/Editable Form',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
