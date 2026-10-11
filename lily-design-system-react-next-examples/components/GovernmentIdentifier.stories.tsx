import type { Meta, StoryObj } from '@storybook/react-vite';
import GovernmentIdentifier from './GovernmentIdentifier';

const meta = {
  title: 'Headless/GovernmentIdentifier',
  component: GovernmentIdentifier,
  tags: ['autodocs']
} satisfies Meta<typeof GovernmentIdentifier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
