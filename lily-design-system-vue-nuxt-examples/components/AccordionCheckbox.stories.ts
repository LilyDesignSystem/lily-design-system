import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AccordionCheckbox from './AccordionCheckbox.vue';

const meta = {
  title: 'Headless/AccordionCheckbox',
  component: AccordionCheckbox,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
