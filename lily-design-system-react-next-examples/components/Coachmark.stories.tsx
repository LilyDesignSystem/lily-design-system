import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Coachmark from './Coachmark';

const meta = {
  title: 'Examples/Coachmark',
  component: Coachmark,
  tags: ['autodocs']
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
