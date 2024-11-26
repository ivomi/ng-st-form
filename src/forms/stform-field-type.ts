import { Component, computed, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { StFormControlOptions } from './stform';

@Component({
  selector: 'st-form-field-type',
  standalone: true,
  template: '',
})
export class StFormFieldType {
  key = input.required<string>();
  control = input.required<FormControl>();
  options = input.required<StFormControlOptions>();
  isRequired = computed(() => this.control().hasValidator(Validators.required));
}
