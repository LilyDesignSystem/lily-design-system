import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Form component -->\n<!--\n  Description: a form element for collecting and submitting user data\n  HTML tag: <form>\n  CSS class: form\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <form class=\"form\" aria-label=\"Example\">\n      ...\n    </form>\n-->\n\n<form\n  class=\"form\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides form fields -->\n</form>";

const meta = {
  title: 'Headless/Form',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
