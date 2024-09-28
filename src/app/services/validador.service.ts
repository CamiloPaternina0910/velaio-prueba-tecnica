import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

/**
 * Validaciones personalizadas.
 *
 * @author Camilo Paternina
 */

@Injectable({
  providedIn: 'root',
})
export class ValidadorService {
  private _messageService = inject(MessageService);
  /**
   * Valida si campo tiene valor
   * @param nombreCampo - nombre del formulario
   * @returns
   */
  requerido(nombreCampo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valorControl: any = control.value;

      if (
        valorControl == null ||
        valorControl == undefined ||
        (typeof valorControl == 'string' && valorControl.trim().length == 0)
      ) {
        return {
          requerido: true,
          msg: `El campo "${nombreCampo.toLocaleLowerCase()}" es requerido`,
        };
      }

      return null;
    };
  }

  /**
   * Valida si el campo es un array y no está vacío
   * @param nombreCampo - nombre del campo del formulario
   * @returns ValidatorFn
   */
  esArrayYNoVacio(nombreCampo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valorControl: any = control.value;

      // Comprobar si el valor es un array
      const esArray = Array.isArray(valorControl);

      // Si no es un array o está vacío, devolver un error
      if (!esArray || valorControl.length === 0) {
        return {
          arrayVacio: true,
          msg: `El campo "${nombreCampo.toLocaleLowerCase()}" no puede estar vacío`,
        };
      }

      return null; // Si el array tiene elementos, la validación pasa
    };
  }

  /**
   * Este valida que dos campos tengan el mismo valor
   * @param campo1 - El campo inicial, array de dos items donde el primero es nombre del campo en el formulario y el segundo es el nombre del campo en el mensaje de error
   * @param campo2 - El campo que debe ser igual, array de dos items donde el primero es nombre del campo en el formulario y el segundo es el nombre del campo en el mensaje de error
   * @returns
   */
  sonIgualesLosCampos(campo1: string[], campo2: string[]) {
    return (formulario: FormGroup): ValidationErrors | null => {
      const controlCampo1 = formulario.get(campo1[0]);
      const controlCampo2 = formulario.get(campo2[0]);

      if (controlCampo2?.value != controlCampo1?.value) {
        controlCampo2?.markAsDirty();
        return {
          noSonIguales: true,
          msg: `El campo '${campo2[1]}' no es igual al campo '${campo2[1]}'`,
        };
      }

      return null;
    };
  }

  /**
   * Este valida que el campo tenga un minimo de caracteres
   * @param minimoCaracteres - numero minimo de caracteres permitidos
   * @param nombreCampo -  nombre del campo
   * @returns
   */
  tieneMinimoCaracteres(
    minimoCaracteres: number,
    nombreCampo: string
  ): ValidatorFn {
    return (control: AbstractControl) => {
      if ((control.value as string)?.length < minimoCaracteres) {
        return {
          minimoCaracteres: true,
          msg: `El número de carácteres de '${nombreCampo}'debe ser mayor a ${minimoCaracteres}`,
        };
      }

      return null;
    };
  }

  /**
   * Este valida que el campo tenga un maximo de caracteres
   * @param control - control del formulario
   * @param maximoCaracteres - maximo de caracteres permitidos
   * @param nombreCampo - nombre del campo
   * @returns
   */
  tieneMaximoCaracteres(
    maximoCaracteres: number,
    nombreCampo: string
  ): ValidatorFn {
    return (control: AbstractControl) => {
      if ((control.value as string)?.length > maximoCaracteres) {
        return {
          maximoCaracteres: true,
          msg: `El número de carácteres de '${nombreCampo}' debe ser menor a ${maximoCaracteres}`,
        };
      }

      return null;
    };
  }

  /**
   * Este valida que el valor del campo no sea menor al valor permitodo
   * @param control - control en el formulario
   * @param valorMinimo - valor minimo permitido en el campo
   * @param nombreCampo - nombre del campo
   * @returns
   */
  valorMinimoPermitido(valorMinimo: number, nombreCampo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valorCampo = control.value;
      if (valorCampo < valorMinimo) {
        return {
          menorValorMinimo: true,
          msg: `El valor mínimo permitido del campo '${nombreCampo}' es: ${valorMinimo}`,
        };
      }

      return null;
    };
  }

  /**
   * Este valida que el valor del campo no sea mayor al valor permitodo
   * @param valorMaximo - valor maximo permitido en el campo
   * @param nombreCampo - nombre del campo
   * @returns
   */
  valorMaximoPermitido(valorMaximo: number, nombreCampo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valorCampo = control.value;
      if (valorCampo < valorMaximo) {
        return {
          superaValorMaximo: true,
          msg: `El valor máximo permitido del campo '${nombreCampo}' es: ${valorMaximo}`,
        };
      }

      return null;
    };
  }

  /**
   * Este valida que el valor del control sea un objecto
   * @param nombreCampo - nombre del campo
   * @returns
   */
  esObjeto(nombreCampo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valorControl: any = control.value;
      if (valorControl && typeof valorControl != 'object') {
        return {
          noEsObjecto: true,
          msg: `El campo '${nombreCampo}' no ha sido seleccionado`,
        };
      }
      return null;
    };
  }

  validarCamposPorFormulario(
    formulario: AbstractControl,
    errors: any[] = []
  ): any[] | null {
    if (formulario instanceof FormGroup) {
      const formGroup = formulario as FormGroup;
      const llaves: string[] = Object.keys(formGroup.controls);

      llaves.forEach((key) => {
        const control = formGroup.controls[key];
        this.validarCamposPorFormulario(control, errors);
      });
    } else if (formulario instanceof FormArray) {
      const formArray = formulario as FormArray;

      formArray.controls.forEach((control) => {
        this.validarCamposPorFormulario(control, errors);
      });
    } else if (formulario.invalid) {
      formulario.updateValueAndValidity();
      formulario.markAsDirty();
      errors.push(formulario.errors);
    }
    return errors.length > 0 ? errors : null;
  }

  mostrarToastConErrores(
    formulario: AbstractControl,
    tituloToast = 'No se pudo enviar el formulario'
  ) {
    let errores = this.validarCamposPorFormulario(formulario);
    if (errores) {
      this.mostrarToastRecursivamente(errores, tituloToast);
    }
    return;
  }

  private mostrarToastRecursivamente(errores: any[], tituloToast: string) {
    errores.forEach((error) => {
      if (Array.isArray(error)) {
        let nErrors = error as any[];
        this.mostrarToastRecursivamente(nErrors, tituloToast);
      } else {
        if (error && error.msg) {
          this._messageService.add({
            severity: 'warn',
            summary: tituloToast,
            detail: error.msg,
          });
        }
      }
    });
  }
}
