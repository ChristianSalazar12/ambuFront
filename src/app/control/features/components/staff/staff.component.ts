import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Paramedico {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  tipoMedico: string;
  numeroCirujano?: string;
  idCapacitacion?: string;
  estado?: string;
  fechaRegistro?: string;
  ultimaActualizacion?: string;
  foto?: string;
}

interface Filtros {
  nombre: string;
  apellido: string;
  documento: string;
  tipoMedico: string;
  numeroCirujano: string;
  idCapacitacion: string;
}

interface TipoMedico {
  label: string;
  value: string;
}

@Component({
  selector: 'app-staff',
  imports: [
    HttpClientModule,
    FormsModule,
    TableModule,
    FileUploadModule,
    DialogModule,
    DropdownModule,
    CommonModule,
    ToastModule],
  providers: [MessageService],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {

  // Variables de control
  mostrarFiltros: boolean = false;
  mostrarDialog: boolean = false;
  modoEdicion: boolean = false;

  // Datos
  paramedicos: Paramedico[] = [];
  paramedicoSeleccionado: Paramedico | null = null;
  fotoSeleccionada: string | null = null;

  // Formulario
  paramedicoForm: Partial<Paramedico> = {
    nombre: '',
    apellido: '',
    documento: '',
    tipoMedico: '',
    numeroCirujano: '',
    idCapacitacion: ''
  };

  // Filtros
  filtros: Filtros = {
    nombre: '',
    apellido: '',
    documento: '',
    tipoMedico: '',
    numeroCirujano: '',
    idCapacitacion: ''
  };

  // Opciones para dropdown
  tiposMedico: TipoMedico[] = [
    { label: 'Médico General', value: 'general' },
    { label: 'Especialista', value: 'especialista' },
    { label: 'Cirujano', value: 'cirujano' },
    { label: 'Paramédico', value: 'paramedico' },
    { label: 'Enfermero', value: 'enfermero' },
    { label: 'Técnico', value: 'tecnico' }
  ];

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.cargarDatosPrueba();
  }

  // Cargar datos de prueba
  cargarDatosPrueba(): void {
    this.paramedicos = [
      {
        id: 1,
        nombre: 'Juan Carlos',
        apellido: 'Rodríguez',
        documento: '12345678',
        tipoMedico: 'Médico General',
        numeroCirujano: 'CIR001',
        idCapacitacion: 'CAP001',
        estado: 'Activo',
        fechaRegistro: '2024-01-15',
        ultimaActualizacion: '2024-03-10'
      },
      {
        id: 2,
        nombre: 'María Elena',
        apellido: 'González',
        documento: '87654321',
        tipoMedico: 'Especialista',
        numeroCirujano: 'CIR002',
        idCapacitacion: 'CAP002',
        estado: 'Activo',
        fechaRegistro: '2024-02-20',
        ultimaActualizacion: '2024-03-15'
      },
      {
        id: 3,
        nombre: 'Pedro',
        apellido: 'Martínez',
        documento: '11223344',
        tipoMedico: 'Paramédico',
        numeroCirujano: '',
        idCapacitacion: 'CAP003',
        estado: 'Activo',
        fechaRegistro: '2024-01-10',
        ultimaActualizacion: '2024-02-28'
      },
      {
        id: 4,
        nombre: 'Ana Sofía',
        apellido: 'López',
        documento: '44332211',
        tipoMedico: 'Enfermero',
        numeroCirujano: '',
        idCapacitacion: 'CAP004',
        estado: 'Activo',
        fechaRegistro: '2024-03-01',
        ultimaActualizacion: '2024-03-20'
      },
      {
        id: 5,
        nombre: 'Roberto',
        apellido: 'Fernández',
        documento: '55667788',
        tipoMedico: 'Cirujano',
        numeroCirujano: 'CIR003',
        idCapacitacion: 'CAP005',
        estado: 'Activo',
        fechaRegistro: '2024-01-25',
        ultimaActualizacion: '2024-03-12'
      }
    ];
  }

  // Agregar nuevo paramédico
  agregarParametrico(): void {
    this.modoEdicion = false;
    this.limpiarFormulario();
    this.mostrarDialog = true;
  }

  // Editar paramédico existente
  editarParametrico(paramedico?: Paramedico): void {
    if (paramedico) {
      this.paramedicoSeleccionado = paramedico;
    }

    if (!this.paramedicoSeleccionado) {
      this.mostrarMensaje('warn', 'Advertencia', 'Debe seleccionar un paramédico para editar');
      return;
    }

    this.modoEdicion = true;
    this.cargarDatosFormulario(this.paramedicoSeleccionado);
    this.mostrarDialog = true;
  }

  // Eliminar paramédico
  eliminarParametrico(paramedico?: Paramedico): void {
    const paramedicoAEliminar = paramedico || this.paramedicoSeleccionado;

    if (!paramedicoAEliminar) {
      this.mostrarMensaje('warn', 'Advertencia', 'Debe seleccionar un paramédico para eliminar');
      return;
    }

    if (confirm(`¿Está seguro de eliminar a ${paramedicoAEliminar.nombre} ${paramedicoAEliminar.apellido}?`)) {
      this.paramedicos = this.paramedicos.filter(p => p.id !== paramedicoAEliminar.id);
      this.paramedicoSeleccionado = null;
      this.mostrarMensaje('success', 'Éxito', 'Paramédico eliminado correctamente');
    }
  }

  // Guardar paramédico (crear o actualizar)
  guardarParametrico(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicion && this.paramedicoSeleccionado) {
      // Actualizar existente
      const index = this.paramedicos.findIndex(p => p.id === this.paramedicoSeleccionado!.id);
      if (index !== -1) {
        this.paramedicos[index] = {
          ...this.paramedicos[index],
          ...this.paramedicoForm,
          ultimaActualizacion: new Date().toISOString().split('T')[0]
        };
        this.mostrarMensaje('success', 'Éxito', 'Paramédico actualizado correctamente');
      }
    } else {
      // Crear nuevo
      const nuevoParametrico: Paramedico = {
        id: this.generarNuevoId(),
        nombre: this.paramedicoForm.nombre!,
        apellido: this.paramedicoForm.apellido!,
        documento: this.paramedicoForm.documento!,
        tipoMedico: this.obtenerLabelTipoMedico(this.paramedicoForm.tipoMedico!),
        numeroCirujano: this.paramedicoForm.numeroCirujano || '',
        idCapacitacion: this.paramedicoForm.idCapacitacion || '',
        estado: 'Activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
        ultimaActualizacion: new Date().toISOString().split('T')[0]
      };

      this.paramedicos.push(nuevoParametrico);
      this.mostrarMensaje('success', 'Éxito', 'Paramédico agregado correctamente');
    }

    this.cancelarDialog();
  }

  // Aplicar filtros
  aplicarFiltros(): void {
    // En una aplicación real, aquí se haría la llamada al servicio con los filtros
    this.mostrarMensaje('info', 'Información', 'Filtros aplicados correctamente');
    console.log('Filtros aplicados:', this.filtros);
  }

  // Limpiar filtros
  limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      apellido: '',
      documento: '',
      tipoMedico: '',
      numeroCirujano: '',
      idCapacitacion: ''
    };
    this.mostrarMensaje('info', 'Información', 'Filtros limpiados');
  }

  // Manejar selección de foto
  onFotoSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoSeleccionada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Eliminar foto
  eliminarFoto(): void {
    this.fotoSeleccionada = null;
    this.mostrarMensaje('info', 'Información', 'Foto eliminada');
  }

  // Cancelar dialog
  cancelarDialog(): void {
    this.mostrarDialog = false;
    this.limpiarFormulario();
    this.paramedicoSeleccionado = null;
  }

  // Validar formulario
  private validarFormulario(): boolean {
    if (!this.paramedicoForm.nombre?.trim()) {
      this.mostrarMensaje('error', 'Error', 'El nombre es requerido');
      return false;
    }

    if (!this.paramedicoForm.apellido?.trim()) {
      this.mostrarMensaje('error', 'Error', 'El apellido es requerido');
      return false;
    }

    if (!this.paramedicoForm.documento?.trim()) {
      this.mostrarMensaje('error', 'Error', 'El documento es requerido');
      return false;
    }

    if (!this.paramedicoForm.tipoMedico) {
      this.mostrarMensaje('error', 'Error', 'El tipo de médico es requerido');
      return false;
    }

    // Validar documento único (excepto en edición)
    const documentoExiste = this.paramedicos.some(p =>
      p.documento === this.paramedicoForm.documento &&
      (!this.modoEdicion || p.id !== this.paramedicoSeleccionado?.id)
    );

    if (documentoExiste) {
      this.mostrarMensaje('error', 'Error', 'Ya existe un paramédico con este documento');
      return false;
    }

    return true;
  }

  // Limpiar formulario
  private limpiarFormulario(): void {
    this.paramedicoForm = {
      nombre: '',
      apellido: '',
      documento: '',
      tipoMedico: '',
      numeroCirujano: '',
      idCapacitacion: ''
    };
  }

  // Cargar datos en formulario
  private cargarDatosFormulario(paramedico: Paramedico): void {
    this.paramedicoForm = {
      nombre: paramedico.nombre,
      apellido: paramedico.apellido,
      documento: paramedico.documento,
      tipoMedico: this.obtenerValueTipoMedico(paramedico.tipoMedico),
      numeroCirujano: paramedico.numeroCirujano || '',
      idCapacitacion: paramedico.idCapacitacion || ''
    };
  }

  // Generar nuevo ID
  private generarNuevoId(): number {
    return Math.max(...this.paramedicos.map(p => p.id), 0) + 1;
  }

  // Obtener label del tipo de médico
  private obtenerLabelTipoMedico(value: string): string {
    const tipo = this.tiposMedico.find(t => t.value === value);
    return tipo ? tipo.label : value;
  }

  // Obtener value del tipo de médico
  private obtenerValueTipoMedico(label: string): string {
    const tipo = this.tiposMedico.find(t => t.label === label);
    return tipo ? tipo.value : label;
  }

  // Mostrar mensaje
  private mostrarMensaje(severity: string, summary: string, detail: string): void {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000
    });
  }
}
