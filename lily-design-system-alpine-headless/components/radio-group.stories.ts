import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RadioGroup component -->\n<!--\n  Description: a group of radio buttons for selecting one option\n  HTML tag: <fieldset>\n  CSS class: radio-group\n  Keyboard: None (passive element)\n  Accessibility: role=\"radiogroup\", aria-label for accessible name\n  Usage:\n    <fieldset class=\"radio-group\" role=\"radiogroup\" aria-label=\"Example\">\n      ...\n    </fieldset>\n-->\n\n<fieldset\n  class=\"radio-group\"\n  role=\"radiogroup\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</fieldset>";

const meta = {
  title: 'Headless/Radio Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
