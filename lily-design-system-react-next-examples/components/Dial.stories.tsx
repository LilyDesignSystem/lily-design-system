import type { Meta, StoryObj } from '@storybook/react-vite';
import Dial from './Dial';

const meta = {
  title: 'Headless/Dial',
  component: Dial,
  tags: ['autodocs']
} satisfies Meta<typeof Dial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
