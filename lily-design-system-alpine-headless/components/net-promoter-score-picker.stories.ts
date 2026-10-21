import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset class=\"net-promoter-score-picker\" role=\"radiogroup\" aria-label=\"\" x-data=\"{ value: '' }\" :data-value=\"value\">\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"0\" aria-label=\"0\" x-model=\"value\"> 0</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"1\" aria-label=\"1\" x-model=\"value\"> 1</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"2\" aria-label=\"2\" x-model=\"value\"> 2</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"3\" aria-label=\"3\" x-model=\"value\"> 3</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"4\" aria-label=\"4\" x-model=\"value\"> 4</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"5\" aria-label=\"5\" x-model=\"value\"> 5</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"6\" aria-label=\"6\" x-model=\"value\"> 6</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"7\" aria-label=\"7\" x-model=\"value\"> 7</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"8\" aria-label=\"8\" x-model=\"value\"> 8</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"9\" aria-label=\"9\" x-model=\"value\"> 9</label>\n  <label class=\"net-promoter-score-picker-button\"><input type=\"radio\" name=\"nps\" value=\"10\" aria-label=\"10\" x-model=\"value\"> 10</label>\n</fieldset>";

const meta = {
  title: 'Headless/Net Promoter Score Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
