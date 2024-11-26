import { NgClass, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StFormField } from './stform-field';

@Component({
  selector: 'st-form-field-inline',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgComponentOutlet],
  template: '',
})
export class StFormFieldInline extends StFormField {}
