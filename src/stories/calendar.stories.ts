import { argsToTemplate, moduleMetadata, StoryFn, type Meta, type StoryObj } from '@storybook/angular';
import { CalendarDate, UiCalendarMonthComponent } from 'brocol-ui';
import { useArgs } from '@storybook/preview-api';
import { UI_CALENDAR_SELECTION_STRATEGY } from '../../projects/brocol-ui/src/public-api';
import { action } from '@storybook/addon-actions';

type UiCalendarMonthPropsAndCustomArgs = UiCalendarMonthComponent & { selected?: number, rangeStart: number, rangeEnd: number };

class SampleRangeSelectionStrategy {
  onSelect(newSelection: CalendarDate, selectedDays: CalendarDate[] = []): CalendarDate[] {
    if(!selectedDays[0] || selectedDays.length >= 2) {
      return [newSelection];
    }

    if(selectedDays[0].isSame(newSelection)) {
      return [newSelection, newSelection];
    }

    if(newSelection.isBefore(selectedDays[0])) {
      return [newSelection, selectedDays[0]];
    }

    return [selectedDays[0], newSelection];
  }
}

const meta: Meta<UiCalendarMonthPropsAndCustomArgs> = {
  title: 'Brocol-UI/Calendar',
  component: UiCalendarMonthComponent,
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'date'
    }
  },
  render: ({selected, ...args})=>{
    const [_, updateArgs] = useArgs();
    const selectedDate = selected ? [CalendarDate.fromLocalToUTC(new Date(selected))] : [];

    return {
      props: {
        selectedDate,
        ...args,
        selectedChange: (dates: CalendarDate[]) => {
          const datesInLocalTimezone = dates.map((d)=>CalendarDate.fromUTCToLocal(d).getTime());
          updateArgs({ ...args, selected: datesInLocalTimezone[0] });
          action('selectedChange')(dates);
        },
      },
      template: `<ui-calendar-month [selected]="selectedDate" ${argsToTemplate(args)}></ui-calendar-month>`,
    }
  }
};

export default meta;
type Story = StoryObj<UiCalendarMonthPropsAndCustomArgs>;

export const DefaultSingleSelection: Story = {
  name: "Single Selection (Default)"
}

export const RangeSelection: Story = {
  ...meta,
  argTypes: {
    rangeStart: {
      control: 'date'
    },
    rangeEnd: {
      control: 'date'
    }
  },
  decorators: [
    moduleMetadata({
      providers: [{
        provide: UI_CALENDAR_SELECTION_STRATEGY,
        useClass: SampleRangeSelectionStrategy
      }]
    })
  ],
  parameters:{
    controls:{
      exclude: ["selected"]
    }
  },
  render: ({rangeStart, rangeEnd, ...args}: {rangeStart: number, rangeEnd: number})=>{
    const [_, updateArgs] = useArgs();
    const rangeSelection = [];
    if (rangeStart) {
      rangeSelection.push(CalendarDate.fromLocalToUTC(new Date(rangeStart)));

      if(rangeEnd) {
        rangeSelection.push(CalendarDate.fromLocalToUTC(new Date(rangeEnd)));
      }
    }

    return {
      props: {
        rangeSelection,
        ...args,
        selectedChange: (dates: CalendarDate[]) => {
          const datesInLocalTimezone = dates.map((d)=>CalendarDate.fromUTCToLocal(d).getTime());
          updateArgs({...args, rangeStart: datesInLocalTimezone[0], rangeEnd: datesInLocalTimezone[1]});
          action('selectedChange')(dates);
        },
      },
      template: `<ui-calendar-month [selected]="rangeSelection" ${argsToTemplate(args)}></ui-calendar-month>`,
    }
  }
}
