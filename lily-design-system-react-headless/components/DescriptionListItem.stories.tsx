import type { Meta, StoryObj } from '@storybook/react-vite';
import DescriptionListItem from './DescriptionListItem';

const meta = {
  title: 'Headless/DescriptionListItem',
  component: DescriptionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DescriptionListItem>;

export default meta;
type Story = StoryObj<typeof DescriptionListItem>;

export const Default: Story = {};
