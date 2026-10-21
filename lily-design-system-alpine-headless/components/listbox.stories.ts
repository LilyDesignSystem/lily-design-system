import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"listbox\" aria-label=\"\" x-data=\"lilyListbox(false)\" x-bind=\"listbox\">\n  <div class=\"listbox-option\" x-bind=\"option('one')\"><!-- Consumer provides option --></div>\n  <div class=\"listbox-option\" x-bind=\"option('two')\"><!-- Consumer provides option --></div>\n  <div class=\"listbox-option\" x-bind=\"option('three')\"><!-- Consumer provides option --></div>\n</div>";

const meta = {
  title: 'Headless/Listbox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
