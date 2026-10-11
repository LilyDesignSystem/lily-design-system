import type { Meta, StoryObj } from '@storybook/react-vite';
import MutuallyExclusive from './MutuallyExclusive';

const meta = {
  title: 'Headless/MutuallyExclusive',
  component: MutuallyExclusive,
  tags: ['autodocs']
} satisfies Meta<typeof MutuallyExclusive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
