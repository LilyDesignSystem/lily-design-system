import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Caption component -->\n<!--\n  Description: a caption for a table or figure element\n  HTML tag: <caption> wrapped in <table>\n  CSS class: caption\n  Accessibility: aria-label for accessible name\n-->\n\n<table><caption class=\"caption\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</caption></table>";

const meta = {
  title: 'Headless/Caption',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
