import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from 'alc-datepicker';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<UiButtonComponent> = {
  title: 'Alc-Datepicker/Button',
  component: UiButtonComponent,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => {
    return {
      template: '<button ui-button>Primary</button>',
    };
  },
};

export default meta;
type Story = StoryObj<UiButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
