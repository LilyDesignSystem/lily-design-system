import type { Meta, StoryObj } from '@storybook/react-vite';
import Answer from './Answer';

const meta = {
  title: 'Headless/Answer',
  component: Answer,
  tags: ['autodocs']
} satisfies Meta<typeof Answer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
