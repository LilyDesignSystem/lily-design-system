import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScreenReaderSpan from './ScreenReaderSpan.vue';

const meta = {
  title: 'Headless/ScreenReaderSpan',
  component: ScreenReaderSpan,
  tags: ['autodocs']
} satisfies Meta<typeof ScreenReaderSpan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
