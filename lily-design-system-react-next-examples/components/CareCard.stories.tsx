import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CareCard from './CareCard';

const meta = {
  title: 'Examples/CareCard',
  component: CareCard,
  tags: ['autodocs']
} satisfies Meta<typeof CareCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
