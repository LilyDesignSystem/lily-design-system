import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupLaptop from './MockupLaptop';

const meta = {
  title: 'Headless/MockupLaptop',
  component: MockupLaptop,
  tags: ['autodocs']
} satisfies Meta<typeof MockupLaptop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
