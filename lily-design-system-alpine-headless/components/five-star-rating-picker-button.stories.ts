import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FiveStarRatingPickerButton component -->\n<!--\n  Description: a picker button for selecting a 1-5 star rating using radio buttons\n  HTML tag: <button>\n  CSS class: five-star-rating-picker-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: role=\"radio\", Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"five-star-rating-picker-button\" role=\"radio\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"five-star-rating-picker-button\"\n  role=\"radio\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Five Star Rating Picker Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
