import { Service } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Service()
export class SweetAlertService {

  // =========================================================
  // SUCCESS
  // =========================================================

  success(
    title: string,
    text?: string
  ): Promise<any> {

    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#1f2937'
    });

  }


  // =========================================================
  // ERROR
  // =========================================================

  error(
    title: string,
    text?: string
  ): Promise<any> {

    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#1f2937'
    });

  }


  // =========================================================
  // WARNING
  // =========================================================

  warning(
    title: string,
    text?: string
  ): Promise<any> {

    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#1f2937'
    });

  }


  // =========================================================
  // INFO
  // =========================================================

  info(
    title: string,
    text?: string
  ): Promise<any> {

    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#1f2937'
    });

  }


  // =========================================================
  // CONFIRMATION
  // =========================================================

  confirm(
    title: string,
    text?: string,
    confirmText = 'Yes',
    cancelText = 'Cancel'
  ): Promise<any> {

    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });

  }


  // =========================================================
  // LOADING
  // =========================================================

  loading(
    title = 'Please wait...'
  ): void {

    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

  }


  // =========================================================
  // CLOSE
  // =========================================================

  close(): void {

    Swal.close();

  }


  // =========================================================
  // TOAST
  // =========================================================

  toast(
    icon: SweetAlertIcon,
    title: string
  ): Promise<any> {

    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });

  }

}
