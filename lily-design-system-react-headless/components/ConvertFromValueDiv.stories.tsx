import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertFromValueDiv from './ConvertFromValueDiv';

const meta = {
  title: 'Headless/ConvertFromValueDiv',
  component: ConvertFromValueDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertFromValueDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
