import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure class="choropleth-chart"><div class="choropleth-chart-graphic" role="img" aria-label="Example"></div><div class="choropleth-chart-data-table"><table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table></div></figure>`;

const meta = {
  title: 'Headless/ChoroplethChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
