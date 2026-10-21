import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TuaisceartEireannHealthAndCareNumberInput component -->\n<!--\n  Description: an input for entering a Tuaisceart Eireann H&C Number unique national healthcare identifier\n  HTML tag: <input>\n  CSS class: tuaisceart-eireann-health-and-care-number-input\n  Keyboard: Standard text input\n  Accessibility: aria-label, inputmode=\"numeric\", pattern=\"[0-9]{3} [0-9]{3} [0-9]{4}\", autocomplete=\"off\"\n  Usage:\n    <input class=\"tuaisceart-eireann-health-and-care-number-input\" type=\"text\" aria-label=\"H&amp;C Number\" inputmode=\"numeric\" pattern=\"[0-9]{3} [0-9]{3} [0-9]{4}\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"tuaisceart-eireann-health-and-care-number-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{3} [0-9]{3} [0-9]{4}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Tuaisceart Eireann Health And Care Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
