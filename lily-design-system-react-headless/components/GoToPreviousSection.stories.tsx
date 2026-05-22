import type { Meta, StoryObj } from '@storybook/react-vite';
import GoToPreviousSection from './GoToPreviousSection';

const meta = {
  title: 'Headless/GoToPreviousSection',
  component: GoToPreviousSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToPreviousSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
