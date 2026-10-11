import type { Meta, StoryObj } from '@storybook/react-vite';
import AccordionCheckbox from './AccordionCheckbox';

const meta = {
  title: 'Headless/AccordionCheckbox',
  component: AccordionCheckbox,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
