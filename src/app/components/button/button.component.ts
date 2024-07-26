import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, booleanAttribute } from "@angular/core";
import { UiRippleDirective } from "../ripple/ripple.directive";

@Component({
  selector: 'button[ui-button], a[ui-button]',
  styleUrl: './button.component.scss',
  templateUrl: './button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [UiRippleDirective],
})
export class UiButtonComponent {
  @Input({ transform: booleanAttribute }) disabledInteractive = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @HostBinding('attr.aria-disabled') protected get _ariaDisabled() {
    return (this.disabled && this.disabledInteractive) || null;
  }

  @HostBinding('attr.disabled') protected get _disabled() {
    return (this.disabled && !this.disabledInteractive) || null;
  }

  @HostListener('click', ["$event"]) protected onClick(event: MouseEvent) {
    if (this.disabled) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }
}