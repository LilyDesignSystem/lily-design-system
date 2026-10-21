import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Container component -->\n<!--\n  Description: a generic block-level content container\n  HTML tag: <div>\n  CSS class: container\n-->\n\n<div class=\"container\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Container',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
