export class Estado {
  private nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  public es_libre(): boolean {
    if (this.nombre == "Libre") {
      return true;
    } else {
      return false;
    }
  }
}
