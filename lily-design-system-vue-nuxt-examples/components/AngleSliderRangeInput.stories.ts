import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AngleSliderRangeInput from './AngleSliderRangeInput.vue';

const meta = {
  title: 'Headless/AngleSliderRangeInput',
  component: AngleSliderRangeInput,
  tags: ['autodocs']
} satisfies Meta<typeof AngleSliderRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
