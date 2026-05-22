import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SectionHeading from './SectionHeading';

const meta = {
  title: 'Examples/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs']
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
