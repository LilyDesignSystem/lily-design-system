import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure class="heatmap-chart-with-year-of-days"><div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label="Example"></div><div class="heatmap-chart-with-year-of-days-data-table"><table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table></div></figure>`;

const meta = {
  title: 'Headless/HeatmapChartWithYearOfDays',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
