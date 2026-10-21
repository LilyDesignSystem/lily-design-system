import type { Meta, StoryObj } from '@storybook/react-vite';
import CareCard from './CareCard';

const meta = {
  title: 'Headless/CareCard',
  component: CareCard,
  tags: ['autodocs']
} satisfies Meta<typeof CareCard>;

export default meta;
type Story = StoryObj<typeof CareCard>;

export const Default: Story = {};
