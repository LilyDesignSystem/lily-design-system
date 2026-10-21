import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Mark component -->\n<!--\n  Description: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element.\n  HTML tag: <mark>\n  CSS class: mark\n  Contract: a plain wrapper with the base class and children\n-->\n\n<mark class=\"mark\">search_web</mark>";

const meta = {
  title: 'Headless/Mark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
