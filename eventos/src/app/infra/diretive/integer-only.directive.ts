import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]'
})
export class IntegerOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^\d]/g, ''); // Substituir não dígitos por vazio
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
