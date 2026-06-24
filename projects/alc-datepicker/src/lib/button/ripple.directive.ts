import { Directive, ElementRef, HostListener, inject, Renderer2 } from "@angular/core";

const rippleClass = "ui-ripple";

@Directive({
  selector: '[uiRipple]',
  standalone: true
}) export class UiRippleDirective {
  private _rippleEl?: HTMLElement;
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  @HostListener('click', ["$event"]) onClick(event: MouseEvent) {
    this.removeRipple();
    this._rippleEl = this.insertRipple(event);
  }

  private insertRipple(event: MouseEvent): HTMLElement {
    const parentElement: HTMLElement = this.elementRef.nativeElement;
    const diameter = Math.max(parentElement.clientWidth, parentElement.clientHeight);
    const radius = diameter / 2;
    const ripple = this.renderer.createElement("span");

    ripple.classList.add(rippleClass);

    ripple.style.pointerEvents = 'none';
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.offsetX - radius}px`;
    ripple.style.top = `${event.offsetY - radius}px`;

    this.renderer.appendChild(parentElement, ripple);
    return ripple;
  }

  private removeRipple() {
    this._rippleEl?.remove();
  }
}