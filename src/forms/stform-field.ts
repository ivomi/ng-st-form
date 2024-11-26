import { NgClass, NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, effect, inject, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { StForm, StFormControlOptions } from './stform';

@Component({
  selector: 'st-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgComponentOutlet],
  templateUrl: './stform-field.html',
})
export class StFormField implements OnInit {
  private destroyRef = inject(DestroyRef);

  key = input.required<string>();
  control = input.required<FormControl>();
  options = model.required<StFormControlOptions>();
  type = computed(() => this.options().type ?? 'input');
  typeComponent = computed(() => this.getFieldComonent(this.type()));
  isRequired = computed(() => this.control().hasValidator(Validators.required));
  errors = signal<string[]>([]);

  constructor() {
    effect(
      () => {
        this.errors.set(this.mapErrors(this.control()));
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.control()
      .root.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const expression = this.options().expression;
        if (expression) expression(this.control(), this.options);
        this.errors.set(this.mapErrors(this.control()));
      });
  }

  mapErrors(control: FormControl): string[] {
    const errors = control.errors ?? {};
    return Object.keys(errors).map(key => {
      const message = StForm.validationMessages[key];
      if (!message) {
        console.error(`Missing validation message for ${key}`);
        return key;
      }
      return typeof message === 'function' ? message(errors[key], control) : message;
    });
  }

  getFieldComonent(type: string) {
    const component = StForm.types[type];
    if (!component) {
      throw new Error(`Unknown field type: ${type}`);
    }
    return component;
  }
}
