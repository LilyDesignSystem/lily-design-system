import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"mentions-input\" data-trigger-char=\"@\" x-data=\"lilyMentions('@')\">\n  <input class=\"mentions-input-control\" type=\"text\" aria-label=\"\" aria-haspopup=\"listbox\" aria-expanded=\"false\" aria-autocomplete=\"list\" aria-controls=\"mentions-input-suggestions-1\" x-bind=\"input\">\n  <div class=\"mentions-input-suggestions\" id=\"mentions-input-suggestions-1\" role=\"listbox\" aria-label=\"\" hidden x-bind=\"panel\">\n    <div class=\"mentions-input-option\" x-bind=\"option('mentions-input-option-1')\"><!-- Consumer provides suggestion --></div>\n    <div class=\"mentions-input-option\" x-bind=\"option('mentions-input-option-2')\"><!-- Consumer provides suggestion --></div>\n    <div class=\"mentions-input-option\" x-bind=\"option('mentions-input-option-3')\"><!-- Consumer provides suggestion --></div>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Mentions Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
