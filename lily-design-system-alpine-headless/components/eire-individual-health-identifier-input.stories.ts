import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EireIndividualHealthIdentifierInput component -->\n<!--\n  Description: an input for entering Eire IHI unique national healthcare identifier\n  HTML tag: <input>\n  CSS class: eire-individual-health-identifier-input\n  Keyboard: Standard text input\n  Accessibility: aria-label, inputmode=\"numeric\", pattern=\"[0-9]{10}\", autocomplete=\"off\"\n  Usage:\n    <input class=\"eire-individual-health-identifier-input\" type=\"text\" aria-label=\"IHI\" inputmode=\"numeric\" pattern=\"[0-9]{10}\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"eire-individual-health-identifier-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{10}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Eire Individual Health Identifier Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
