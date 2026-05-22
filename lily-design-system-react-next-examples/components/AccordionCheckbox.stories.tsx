import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccordionCheckbox from './AccordionCheckbox';

const meta = {
  title: 'Examples/AccordionCheckbox',
  component: AccordionCheckbox,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
