import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Option component -->\n<!--\n  Description: an option element within a select dropdown\n  HTML tag: <option> wrapped in <select>\n  CSS class: option\n  Accessibility: aria-label for accessible name\n-->\n\n<select><option class=\"option\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</option></select>";

const meta = {
  title: 'Headless/Option',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
