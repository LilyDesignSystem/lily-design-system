import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"wheel-picker\" data-page-size=\"5\">\n  <div class=\"wheel-picker-list\" role=\"listbox\" aria-orientation=\"vertical\" aria-label=\"Month\" tabindex=\"0\" aria-activedescendant=\"wheel-month-2\">\n    <div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-month-1\" aria-selected=\"false\" data-value=\"1\">January</div>\n    <div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-month-2\" aria-selected=\"true\" data-value=\"2\">February</div>\n    <div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-month-3\" aria-selected=\"false\" data-value=\"3\">March</div>\n    <div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-month-4\" aria-selected=\"false\" aria-disabled=\"true\" data-value=\"4\">April</div>\n    <div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-month-5\" aria-selected=\"false\" data-value=\"5\">May</div>\n  </div>\n  <input type=\"hidden\" name=\"month\" value=\"2\">\n</div>";

const meta = {
  title: 'Headless/WheelPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
