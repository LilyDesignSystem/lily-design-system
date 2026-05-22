import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GovernmentIdentifier from './GovernmentIdentifier';

const meta = {
  title: 'Examples/GovernmentIdentifier',
  component: GovernmentIdentifier,
  tags: ['autodocs']
} satisfies Meta<typeof GovernmentIdentifier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
