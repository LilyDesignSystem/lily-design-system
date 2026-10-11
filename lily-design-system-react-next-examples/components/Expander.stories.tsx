import type { Meta, StoryObj } from '@storybook/react-vite';
import Expander from './Expander';

const meta = {
  title: 'Headless/Expander',
  component: Expander,
  tags: ['autodocs']
} satisfies Meta<typeof Expander>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
