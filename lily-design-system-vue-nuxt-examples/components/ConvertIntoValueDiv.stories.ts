import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertIntoValueDiv from './ConvertIntoValueDiv.vue';

const meta = {
  title: 'Headless/ConvertIntoValueDiv',
  component: ConvertIntoValueDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoValueDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
