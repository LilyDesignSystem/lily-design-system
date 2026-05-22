import type { Meta, StoryObj } from '@storybook/react-vite';
import Framer from './Framer';

const meta = {
  title: 'Headless/Framer',
  component: Framer,
  tags: ['autodocs']
} satisfies Meta<typeof Framer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
