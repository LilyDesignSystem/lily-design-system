import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertIntoValueDiv from './ConvertIntoValueDiv';

const meta = {
  title: 'Headless/ConvertIntoValueDiv',
  component: ConvertIntoValueDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoValueDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
