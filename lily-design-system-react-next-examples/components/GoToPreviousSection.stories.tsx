import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GoToPreviousSection from './GoToPreviousSection';

const meta = {
  title: 'Examples/GoToPreviousSection',
  component: GoToPreviousSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToPreviousSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
