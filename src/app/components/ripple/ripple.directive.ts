import { Directive, ElementRef, HostListener, inject, Renderer2 } from "@angular/core";


@Directive({
    selector: 'ui-ripple',
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
  
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.pageX - parentElement.offsetLeft - radius}px`;
    ripple.style.top = `${event.pageY - parentElement.offsetTop - radius}px`;
    ripple.classList.add("ui-ripple");
  
    this.renderer.appendChild(parentElement, ripple);
    return ripple;
  }

  private removeRipple() {
    this._rippleEl?.remove();
    this._rippleEl = undefined;
  }
}