import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure class="line-chart"><div class="line-chart-graphic" role="img" aria-label="Example"></div><div class="line-chart-data-table"><table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table></div></figure>`;

const meta = {
  title: 'Headless/LineChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
