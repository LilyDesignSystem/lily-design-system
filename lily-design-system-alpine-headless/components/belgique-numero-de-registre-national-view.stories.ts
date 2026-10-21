import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"belgique-numero-de-registre-national-view\"\n  aria-label=\"National Register Number\"\n></span>";

const meta = {
  title: 'Headless/Belgique Numero De Registre National View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
