import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BackLink from './BackLink';

const meta = {
  title: 'Examples/BackLink',
  component: BackLink,
  tags: ['autodocs']
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
