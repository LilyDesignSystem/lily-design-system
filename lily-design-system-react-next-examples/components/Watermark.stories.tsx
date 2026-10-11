import type { Meta, StoryObj } from '@storybook/react-vite';
import Watermark from './Watermark';

const meta = {
  title: 'Headless/Watermark',
  component: Watermark,
  tags: ['autodocs']
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
