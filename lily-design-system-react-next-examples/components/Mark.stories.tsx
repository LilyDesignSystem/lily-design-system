import type { Meta, StoryObj } from '@storybook/react-vite';
import Mark from './Mark';

const meta = {
  title: 'Headless/Mark',
  component: Mark,
  tags: ['autodocs']
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
