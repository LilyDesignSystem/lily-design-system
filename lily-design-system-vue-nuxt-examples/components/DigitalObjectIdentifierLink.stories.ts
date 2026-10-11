import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DigitalObjectIdentifierLink from './DigitalObjectIdentifierLink.vue';

const meta = {
  title: 'Headless/DigitalObjectIdentifierLink',
  component: DigitalObjectIdentifierLink,
  tags: ['autodocs']
} satisfies Meta<typeof DigitalObjectIdentifierLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
