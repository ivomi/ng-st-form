import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StFormFieldType } from './stform-field-type';

@Component({
  selector: 'st-form-field-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './stform-field-input.html',
})
export class StFormFieldInput extends StFormFieldType {}
