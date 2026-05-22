import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScreenReaderSpan from './ScreenReaderSpan';

const meta = {
  title: 'Examples/ScreenReaderSpan',
  component: ScreenReaderSpan,
  tags: ['autodocs']
} satisfies Meta<typeof ScreenReaderSpan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
