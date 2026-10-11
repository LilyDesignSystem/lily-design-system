import type { Meta, StoryObj } from '@storybook/react-vite';
import GoToNextSection from './GoToNextSection';

const meta = {
  title: 'Headless/GoToNextSection',
  component: GoToNextSection,
  tags: ['autodocs']
} satisfies Meta<typeof GoToNextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
