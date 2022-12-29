export class Cliente {
  id_cliente?: number;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno: string;
  fechanacimiento: Date;
  sexo: boolean;
  direccion: string;
  correoelectronico: string;


  constructor(nombre: string, apellidopaterno: string, apellidomaterno: string,
    fechanacimiento: Date, sexo: boolean, direccion: string, correoelectronico: string) {
    this.nombre = nombre;
    this.apellidopaterno = apellidopaterno;
    this.apellidomaterno = apellidomaterno;
    this.fechanacimiento = fechanacimiento;
    this.sexo = sexo;
    this.direccion = direccion;
    this.correoelectronico = correoelectronico;
  }


}