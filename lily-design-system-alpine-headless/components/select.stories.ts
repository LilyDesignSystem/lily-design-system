import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Select component -->\n<!--\n  Description: a dropdown select element for choosing one option\n  HTML tag: <select>\n  CSS class: select\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: aria-label for accessible name\n  Usage:\n    <select class=\"select\" aria-label=\"Example\">\n      ...\n    </select>\n-->\n\n<select\n  class=\"select\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides option elements -->\n</select>";

const meta = {
  title: 'Headless/Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
