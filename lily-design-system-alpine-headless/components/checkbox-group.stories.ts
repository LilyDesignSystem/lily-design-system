import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CheckboxGroup component -->\n<!--\n  Description: a group component that manages a collection of checkboxes with shared state\n  HTML tag: <fieldset>\n  CSS class: checkbox-group\n  Keyboard: None (passive element)\n  Accessibility: role=\"group\", aria-label for accessible name\n  Usage:\n    <fieldset class=\"checkbox-group\" role=\"group\" aria-label=\"Example\">\n      ...\n    </fieldset>\n-->\n\n<fieldset\n  class=\"checkbox-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</fieldset>";

const meta = {
  title: 'Headless/Checkbox Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
