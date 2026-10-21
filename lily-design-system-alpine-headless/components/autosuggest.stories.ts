import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Autosuggest component -->\n<div\n  class=\"autosuggest\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Autosuggest',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
