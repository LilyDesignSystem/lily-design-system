import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure class="candlestick-chart"><div class="candlestick-chart-graphic" role="img" aria-label="Example"></div><div class="candlestick-chart-data-table"><table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table></div></figure>`;

const meta = {
  title: 'Headless/CandlestickChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
