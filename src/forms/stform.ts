import { NgClass, NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, Type, WritableSignal, computed, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  ɵElement,
} from '@angular/forms';
import { get, set } from '../utils';
import { Observable } from 'rxjs';
import { StFormField } from './stform-field';
import { StFormFieldInput } from './stform-field-input';
import { StFormFieldType } from './stform-field-type';

export type StFormOptions = AbstractControlOptions & {
  group?: string;
  groupClass?: string[];
};

export type StFormControlOptions = AbstractControlOptions & {
  group?: string;
  groupClass?: string[];
  validators?: ValidatorFn[];
  expression?: (control: FormControl, options: WritableSignal<StFormControlOptions>) => void;
  type?: string;
  props?: {
    type?: string;
    options?: any[] | Observable<any[]>;
    class?: string[];
    label?: string;
    labelClass?: string[];
    placeholder?: string;
    readonly?: boolean;
    disabled?: boolean;
    rows?: number;
    cols?: number;
    hidden?: boolean;
    tabindex?: number;
    max?: number;
    min?: number;
    step?: number;
    attributes?: {
      [key: string]: string | number;
    };
  } & Record<string, any>;
};

export type ValidationMessage = string | ((error: any, control: FormControl) => string);

export class StForm {
  static types: Record<string, Type<StFormFieldType>> = {
    input: StFormFieldInput,
  };

  static wrappers: Record<string, Type<StFormField>> = {
    form: StFormField,
  };

  static validationMessages: Record<string, ValidationMessage> = {
    required: 'This field is required',
    email: 'Field is not a valid email',
    minlength: (error: { requiredLength: number; actualLength: number }) =>
      `Minimum length is ${error.requiredLength} characters, but got ${error.actualLength}`,
    maxlength: (error: { requiredLength: number; actualLength: number }) =>
      `Maximum length is ${error.requiredLength} characters, but got ${error.actualLength}`,
    min: (error: { min: number; actual: number }) => `Minimum value is ${error.min}, but got ${error.actual}`,
    max: (error: { max: number; actual: number }) => `Maximum value is ${error.max}, but got ${error.actual}`,
  };

  static control<TValue>(value: TValue | null, options: StFormControlOptions = {}): FormControl<TValue | null> {
    const control = new FormControl(value, options);
    set(control, 'options', options);
    return control;
  }

  static group<T extends {}>(controls: T, options?: StFormOptions): FormGroup<{ [K in keyof T]: ɵElement<T[K], null> }> {
    const group = new FormBuilder().group<T>(controls, options);
    set(group, 'options', options);
    return group;
  }

  static array<T>(controls: T[], options?: StFormOptions): FormArray<ɵElement<T, null>> {
    const array = new FormBuilder().array<T>(controls, options);
    set(array, 'options', options);
    return array;
  }
}

type StFormControl = { key: string } & (
  | { type: 'group'; control: FormGroup; options: StFormOptions }
  | { type: 'array'; control: FormArray; options: StFormOptions }
  | { type: 'control'; control: FormControl; options: StFormControlOptions }
);

@Component({
  selector: 'st-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgComponentOutlet],
  templateUrl: './stform.html',
})
export class StFormComponent<TForm extends FormGroup> {
  private destroyRef = inject(DestroyRef);

  form = input.required<TForm>();
  formValue = output<TForm['value']>();
  wrapper = input<string>(Object.keys(StForm.wrappers)[0]);
  wrapperComponent = computed(() => this.getWrapperComponent(this.wrapper()));
  controls = computed(() => this.mapControls(this.form()));
  groupedControls = computed(() => this.mapGroups(this.controls()));

  constructor() {
    effect(() => {
      this.form()
        .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(value => this.formValue.emit(value));
    });
  }

  mapControls(form: FormGroup): StFormControl[] {
    return Object.entries(form.controls).map(([key, control]) => {
      const options = get(control, 'options', {});
      if (control instanceof FormGroup) {
        return { key, type: 'group', control, options };
      } else if (control instanceof FormArray) {
        return { key, type: 'array', control, options };
      } else if (control instanceof FormControl) {
        return { key, type: 'control', control, options };
      } else {
        throw new Error(`Unknown control type: ${control} for key: ${key}`);
      }
    });
  }

  mapGroups(controls: StFormControl[]) {
    const groups: Array<{ group?: string; groupClass?: string[]; controls: StFormControl[] }> = [
      { group: undefined, groupClass: [], controls: [] },
    ];

    controls.forEach(field => {
      const { group, groupClass } = field.options;
      const currentGroup = groups[groups.length - 1].group;
      if (group !== currentGroup) {
        groups.push({ group, groupClass, controls: [] });
      }
      groups[groups.length - 1].controls.push(field);
    });

    return groups;
  }

  getWrapperComponent(wrapper: string) {
    const component = StForm.wrappers[wrapper];
    if (!component) {
      throw new Error(`Unknown wrapper component: ${wrapper}`);
    }
    return component;
  }
}
