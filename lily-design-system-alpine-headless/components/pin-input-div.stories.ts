import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"pin-input-div\" role=\"group\" aria-label=\"\" x-data=\"lilyPinInput()\">\n  <input class=\"pin-input-div-digit\" aria-label=\"\" x-bind=\"digit(0)\">\n  <input class=\"pin-input-div-digit\" aria-label=\"\" x-bind=\"digit(1)\">\n  <input class=\"pin-input-div-digit\" aria-label=\"\" x-bind=\"digit(2)\">\n  <input class=\"pin-input-div-digit\" aria-label=\"\" x-bind=\"digit(3)\">\n</div>";

const meta = {
  title: 'Headless/Pin Input Div',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
