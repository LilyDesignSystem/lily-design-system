import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"password-input-or-text-input-div\" x-data=\"lilyPasswordToggle()\">\n  <input class=\"password-input-or-text-input-div-input\" type=\"password\" aria-label=\"\" x-bind=\"input\">\n  <button class=\"password-input-or-text-input-div-toggle\" aria-label=\"\" x-bind=\"toggle\"><!-- Consumer provides toggle icon or text --></button>\n</div>";

const meta = {
  title: 'Headless/Password Input Or Text Input Div',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
