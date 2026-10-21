import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset class=\"five-face-rating-picker\" role=\"radiogroup\" aria-label=\"\" x-data=\"{ value: '' }\" :data-value=\"value\">\n  <label class=\"five-face-rating-picker-button\"><input type=\"radio\" name=\"satisfaction\" value=\"1\" aria-label=\"1\" x-model=\"value\"> 1</label>\n  <label class=\"five-face-rating-picker-button\"><input type=\"radio\" name=\"satisfaction\" value=\"2\" aria-label=\"2\" x-model=\"value\"> 2</label>\n  <label class=\"five-face-rating-picker-button\"><input type=\"radio\" name=\"satisfaction\" value=\"3\" aria-label=\"3\" x-model=\"value\"> 3</label>\n  <label class=\"five-face-rating-picker-button\"><input type=\"radio\" name=\"satisfaction\" value=\"4\" aria-label=\"4\" x-model=\"value\"> 4</label>\n  <label class=\"five-face-rating-picker-button\"><input type=\"radio\" name=\"satisfaction\" value=\"5\" aria-label=\"5\" x-model=\"value\"> 5</label>\n</fieldset>";

const meta = {
  title: 'Headless/Five Face Rating Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
