import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AspectRatioContainer from './AspectRatioContainer.vue';

const meta = {
  title: 'Headless/AspectRatioContainer',
  component: AspectRatioContainer,
  tags: ['autodocs']
} satisfies Meta<typeof AspectRatioContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
