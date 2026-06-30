import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { CalendarDate, AlcCalendarMonthComponent } from 'alc-datepicker';
import { useArgs } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import { WeekDay } from '@angular/common';

type StoryControls = {
  selected?: number;
  month?: number;
  rangeStart: number;
  rangeEnd: number;
  firstDayOfWeek: string[];
};

const onSelect = (
  [newSelection]: CalendarDate[],
  selectedDays: CalendarDate[] = []
) => {
  if (!selectedDays[0] || selectedDays.length >= 2) {
    return [newSelection];
  }

  if (selectedDays[0].isSame(newSelection)) {
    return [newSelection, newSelection];
  }

  if (newSelection.isBefore(selectedDays[0])) {
    return [newSelection, selectedDays[0]];
  }

  return [selectedDays[0], newSelection];
};

const meta: Meta<StoryControls> = {
  title: 'Alc-Datepicker/Calendar',
  component: AlcCalendarMonthComponent,
  tags: ['autodocs'],
  argTypes: {
    month: {
      control: 'date',
    },
    selected: {
      control: 'date',
    },
    firstDayOfWeek: {
      options: Object.values(WeekDay).filter(
        (option) => typeof option === 'number'
      ),
      control: {
        type: 'select',
        labels: Object.values(WeekDay).filter(
          (option) => typeof option !== 'number'
        ),
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['activeDate'],
    },
  },
  render: ({ selected, month, ...args }) => {
    const [_, updateArgs] = useArgs();
    const selectedDate = selected
      ? [CalendarDate.fromLocalToUTC(new Date(selected))]
      : [];
    const shownMonth = month
      ? CalendarDate.fromLocalToUTC(new Date(month))
      : CalendarDate.fromLocalToUTC(new Date());

    return {
      props: {
        selectedDate,
        shownMonth,
        ...args,
        selectedChange: (dates: CalendarDate[]) => {
          const datesInLocalTimezone = dates.map((d) =>
            CalendarDate.fromUTCToLocal(d).getTime()
          );
          updateArgs({ ...args, selected: datesInLocalTimezone[0] });
          action('selectedChange')(dates);
        },
      },
      template: `<alc-calendar-month [selected]="selectedDate" [month]="shownMonth" ${argsToTemplate(args)}></alc-calendar-month>`,
    };
  },
};

export default meta;
type Story = StoryObj<StoryControls>;

export const DefaultSingleSelection: Story = {
  name: 'Single Selection (Default)',
};

export const RangeSelection: Story = {
  ...meta,
  argTypes: {
    rangeStart: {
      control: 'date',
    },
    rangeEnd: {
      control: 'date',
    },
  },
  parameters: {
    controls: {
      exclude: ['selected', 'activeDate'],
    },
  },
  render: ({ rangeStart, rangeEnd, month, ...args }) => {
    const shownMonth = month
      ? CalendarDate.fromLocalToUTC(new Date(month))
      : CalendarDate.fromLocalToUTC(new Date());
    const [_, updateArgs] = useArgs();
    const rangeSelection: CalendarDate[] = [];
    if (rangeStart) {
      rangeSelection.push(CalendarDate.fromLocalToUTC(new Date(rangeStart)));

      if (rangeEnd) {
        rangeSelection.push(CalendarDate.fromLocalToUTC(new Date(rangeEnd)));
      }
    }

    return {
      props: {
        shownMonth,
        rangeSelection,
        ...args,
        selectedChange: (dates: CalendarDate[]) => {
          const newRange = onSelect(dates, rangeSelection);
          const datesInLocalTimezone = newRange.map((d) =>
            CalendarDate.fromUTCToLocal(d).getTime()
          );
          updateArgs({
            ...args,
            rangeStart: datesInLocalTimezone[0],
            rangeEnd: datesInLocalTimezone[1],
          });
          action('selectedChange')(dates);
        },
      },
      template: `<alc-calendar-month [selected]="rangeSelection" [month]="shownMonth" ${argsToTemplate(args)}></alc-calendar-month>`,
    };
  },
};
