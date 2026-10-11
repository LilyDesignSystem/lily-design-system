import type { Meta, StoryObj } from '@storybook/react-vite';
import ScreenReaderSpan from './ScreenReaderSpan';

const meta = {
  title: 'Headless/ScreenReaderSpan',
  component: ScreenReaderSpan,
  tags: ['autodocs']
} satisfies Meta<typeof ScreenReaderSpan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
