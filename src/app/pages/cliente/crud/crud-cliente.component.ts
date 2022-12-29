import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { ResponseMensaje } from 'src/app/models/responseMensaje';
import { ClienteService } from 'src/app/service/cliente.service';
import { TokenService } from 'src/app/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-cliente',
  templateUrl: './crud-cliente.component.html',
  styleUrls: ['./crud-cliente.component.css']
})
export class CrudClienteComponent implements OnDestroy {
  protected readonly unsubscribe$ = new Subject<void>();
  clientes: Cliente[] = [];
  roles: string[];
  isAdmin = false;
  idcliente: number = 0;
  nombretxt: string = '';
  sexos = [
    { value: false, nombre: 'Femenino' },
    { value: true, nombre: 'Masculino' },
  ];

  public clienteForm: FormGroup;
  get nombre() { return this.clienteForm.get('nombre'); }
  get apellidopaterno() { return this.clienteForm.get('apellidopaterno'); }
  get apellidomaterno() { return this.clienteForm.get('apellidomaterno'); }
  get fechanacimiento() { return this.clienteForm.get('fechanacimiento'); }
  get sexo() { return this.clienteForm.get('sexo'); }
  get direccion() { return this.clienteForm.get('direccion'); }
  get correoelectronico() { return this.clienteForm.get('correoelectronico'); }


  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.cargarClientes();
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  cargarClientes(): void {
    this.clienteService.list()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cliente: Cliente[]) => {
        this.clientes = cliente;
      },
        err => {
          this.handleWrongResponse();
        });

    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(255)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(255)]],
      fechanacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      correoelectronico: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  create() {
    const cliente: Cliente = {
      nombre: this.nombre.value,
      apellidopaterno: this.apellidopaterno.value,
      apellidomaterno: this.apellidomaterno.value,
      sexo: this.sexo.value,
      direccion: this.direccion.value,
      correoelectronico: this.correoelectronico.value,
      fechanacimiento: this.fechanacimiento.value
    }
    Swal.fire({
      title: 'Registar',
      text: '¿Desea registrar al cliente ' + + '?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.create(cliente).pipe(takeUntil(this.unsubscribe$))
          .subscribe((res: ResponseMensaje) => {
            this.handleSuccessResponse(res);
          },
            err => {
              this.handleWrongResponse();
            });

      } else if (result.isDenied) {
        Swal.fire('Sin cambios', '', 'info')
      }
    })
  }

  borrar() {
    if (this.idcliente !== 0 && this.nombretxt !== '') {
      Swal.fire({
        title: 'Inhabilitar',
        text: '¿Desea eliminar cliente ' + this.nombretxt + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(this.idcliente)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => {
              this.handleSuccessResponse(res);
              this.cargarClientes();
            },
              err => {
                this.handleWrongResponse();
              });

        } else if (result.isDenied) {
          Swal.fire('Sin cambios', '', 'info')
        }
      })
    } else {
      alert('Seleccione algun registro para eliminar');
    }


  }

  obtenercliente(id_cliente: number, nombre: string) {
    console.log(id_cliente)
    console.log(nombre)
    this.nombretxt = nombre;
    this.idcliente = id_cliente;
  }


  handleSuccessResponse(res: ResponseMensaje) {
    if (res.codigo === 200) {
      Swal.fire(res.mensaje, '', 'success')
      this.ngOnInit();
    } else {
      this.toastr.error(res.mensaje, 'Fail', {
        timeOut: 3000, positionClass: 'toast-top-right',
      });
    }
  }

  handleWrongResponse() {
    this.toastr.error('Error Inesperado', 'Fail', {
      timeOut: 3000, positionClass: 'toast-top-right',
    });
  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
