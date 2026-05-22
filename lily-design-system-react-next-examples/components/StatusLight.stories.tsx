import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StatusLight from './StatusLight';

const meta = {
  title: 'Examples/StatusLight',
  component: StatusLight,
  tags: ['autodocs']
} satisfies Meta<typeof StatusLight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
