import type { Meta, StoryObj } from '@storybook/react-vite';
import Diff from './Diff';

const meta = {
  title: 'Headless/Diff',
  component: Diff,
  tags: ['autodocs']
} satisfies Meta<typeof Diff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
