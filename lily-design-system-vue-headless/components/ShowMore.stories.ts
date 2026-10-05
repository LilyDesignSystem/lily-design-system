import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ShowMore from './ShowMore.vue';

const meta = {
  title: 'Headless/ShowMore',
  component: ShowMore,
  tags: ['autodocs']
} satisfies Meta<typeof ShowMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { moreLabel: 'Show more', lessLabel: 'Show less' },
};
