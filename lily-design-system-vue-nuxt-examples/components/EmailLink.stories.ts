import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmailLink from './EmailLink.vue';

const meta = {
  title: 'Examples/EmailLink',
  component: EmailLink,
  tags: ['autodocs']
} satisfies Meta<typeof EmailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
