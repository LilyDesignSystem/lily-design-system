import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GoToPreviousSection component -->\n<!--\n  Description: a link that takes users to the previous section of the current page\n  HTML tag: <a>\n  CSS class: go-to-previous-section\n-->\n\n<a class=\"go-to-previous-section\" href=\"\" aria-label=\"\"></a>";

const meta = {
  title: 'Headless/Go To Previous Section',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
