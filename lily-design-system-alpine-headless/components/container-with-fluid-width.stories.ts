import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContainerWithFluidWidth component -->\n<!--\n  Description: a full-width content wrapper with horizontal padding\n\n  HTML tag: <div>\n  CSS class: container-with-fluid-width\n  Keyboard: None (passive element)\n  Accessibility: None — purely structural layout container\n\n  Behavior:\n    Inline style applies width: 100% so the container fills its parent,\n    and padding-inline so content does not touch the viewport edges.\n    The data-padding-inline attribute is exposed for consumer CSS hooks.\n\n  Usage:\n    <div class=\"container-with-fluid-width\" data-padding-inline=\"1rem\"\n         style=\"width: 100%; padding-inline: 1rem;\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"container-with-fluid-width\"\n  data-padding-inline=\"1rem\"\n  style=\"width: 100%; padding-inline: 1rem;\"\n>\n  <!-- Consumer provides fluid-width content -->\n</div>";

const meta = {
  title: 'Headless/Container With Fluid Width',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
