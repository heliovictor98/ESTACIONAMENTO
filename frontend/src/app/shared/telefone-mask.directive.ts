import { Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

/** Máscara para celular brasileiro: (XX) 9XXXX-XXXX */
const MASK_CELULAR = (digits: string): string => {
  const d = digits.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

@Directive({
  selector: 'input[appTelefoneMask]',
  standalone: true,
})
export class TelefoneMaskDirective implements OnInit {
  private el = inject(ElementRef<HTMLInputElement>);
  private control = inject(NgControl, { optional: true });

  ngOnInit(): void {
    const initial = this.control?.value ?? this.el.nativeElement.value;
    if (initial != null && initial !== '') {
      const formatted = MASK_CELULAR(String(initial));
      if (this.control?.control) {
        this.control.control.setValue(formatted, { emitEvent: false });
      } else {
        this.el.nativeElement.value = formatted;
      }
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const formatted = MASK_CELULAR(value);
    if (this.control?.control) {
      this.control.control.setValue(formatted, { emitEvent: false });
    } else {
      this.el.nativeElement.value = formatted;
    }
  }
}
