import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GoToNextSection from './GoToNextSection';

const meta = {
  title: 'Examples/GoToNextSection',
  component: GoToNextSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToNextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
