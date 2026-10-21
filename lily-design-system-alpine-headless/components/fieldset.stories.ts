import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Fieldset component -->\n<!--\n  Description: a group of related form fields with a legend\n  HTML tag: <fieldset>\n  CSS class: fieldset\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <fieldset class=\"fieldset\" aria-label=\"Example\">\n      ...\n    </fieldset>\n-->\n\n<fieldset\n  class=\"fieldset\"\n  aria-label=\"\"\n>\n  <legend class=\"fieldset-legend\"><!-- Consumer provides legend text --></legend>\n  <!-- Consumer provides form fields -->\n</fieldset>";

const meta = {
  title: 'Headless/Fieldset',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
