import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ThemeSelectOption component -->\n<!--\n  Description: one option in a theme select dropdown\n  HTML tag: <option> wrapped in <select>\n  CSS class: theme-select-option\n  Accessibility: aria-label for accessible name\n-->\n\n<select><option class=\"theme-select-option\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</option></select>";

const meta = {
  title: 'Headless/Theme Select Option',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
