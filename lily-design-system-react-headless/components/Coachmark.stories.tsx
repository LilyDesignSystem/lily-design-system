import type { Meta, StoryObj } from '@storybook/react-vite';
import Coachmark from './Coachmark';

const meta = {
  title: 'Headless/Coachmark',
  component: Coachmark,
  tags: ['autodocs']
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
