import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset class=\"five-star-rating-picker\" role=\"radiogroup\" aria-label=\"\" x-data=\"{ value: '' }\" :data-value=\"value\">\n  <label class=\"five-star-rating-picker-button\"><input type=\"radio\" name=\"rating\" value=\"1\" aria-label=\"1\" x-model=\"value\"> 1</label>\n  <label class=\"five-star-rating-picker-button\"><input type=\"radio\" name=\"rating\" value=\"2\" aria-label=\"2\" x-model=\"value\"> 2</label>\n  <label class=\"five-star-rating-picker-button\"><input type=\"radio\" name=\"rating\" value=\"3\" aria-label=\"3\" x-model=\"value\"> 3</label>\n  <label class=\"five-star-rating-picker-button\"><input type=\"radio\" name=\"rating\" value=\"4\" aria-label=\"4\" x-model=\"value\"> 4</label>\n  <label class=\"five-star-rating-picker-button\"><input type=\"radio\" name=\"rating\" value=\"5\" aria-label=\"5\" x-model=\"value\"> 5</label>\n</fieldset>";

const meta = {
  title: 'Headless/Five Star Rating Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
