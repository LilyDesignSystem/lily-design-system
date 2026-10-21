import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NetPromoterScorePickerButton component -->\n<!--\n  Description: a picker button for selecting a 0-10 Net Promoter Score\n  HTML tag: <button>\n  CSS class: net-promoter-score-picker-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: role=\"radio\", Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"net-promoter-score-picker-button\" role=\"radio\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"net-promoter-score-picker-button\"\n  role=\"radio\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Net Promoter Score Picker Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
