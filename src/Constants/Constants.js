import presupuestos from '../Images/calculator.jpg';
import ventas from '../Images/sell.jpg';
import estadisticas from '../Images/estadisticas.jpg';
import trabajo from '../Images/trabajo.jpg';
import configuracion from '../Images/configuracion.jpg';
import vendedores from '../Images/vendedores.png';
import tiempos from '../Images/tiempos.jpg';
import clientesImg from '../Images/clientes.jpg';
import analizarImg from '../Images/analizar.png';
import { getColors } from '../helpers/materialColors';

export const USERS_TYPES = {
  admin: 'admin',
  vendedor: 'vendedor',
  trabajador: 'trabajador'
};

export const NAV_LINKS = [
  {
    image: ventas,
    titleActivity: 'Haz Visita',
    descriptionActivity:
      'Aquí vas a apuntar de forma rápida las visitas que estas realizando',
    buttonActivity: 'Visita',
    link: '/Visitas',
    navText: 'Visitas',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor]
  },
  {
    image: presupuestos,
    titleActivity: 'Gestion de Visitas',
    descriptionActivity:
      'Recuerda todo el trabajo realizado y además haz un buen seguimiento',
    buttonActivity: 'Gestiona',
    link: '/gestion',
    navText: 'Gestionar Visitas',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor]
  },
  {
    image: estadisticas,
    titleActivity: 'Estadísticas',
    descriptionActivity:
      'Analiza las visitas que estas realizando para analizar lo que consigues',
    buttonActivity: 'Analizar',
    link: '/estadisticas',
    navText: 'Estadísticas',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor, USERS_TYPES.trabajador]
  },
  {
    image: trabajo,
    titleActivity: 'Fichar',
    descriptionActivity: 'Ficha tu trabajo',
    buttonActivity: 'Fichar',
    link: '/fichar',
    navText: 'Fichar',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor, USERS_TYPES.trabajador]
  },
  {
    image: tiempos,
    titleActivity: 'Ver Trabajo',
    descriptionActivity: 'Visualiza el trabajo realizado',
    buttonActivity: 'Ver',
    link: '/trabajo-realizado',
    navText: 'Trabajo Realizado',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor, USERS_TYPES.trabajador]
  },
  {
    image: configuracion,
    titleActivity: 'Configuración',
    descriptionActivity: 'Configuraciones Generales',
    buttonActivity: 'Configuración',
    link: '/configuracion',
    navText: 'Configuración',
    user: [USERS_TYPES.admin]
  },
  {
    image: vendedores,
    titleActivity: 'Administrar Empleados',
    descriptionActivity: 'Agrega, modficia o eliminia vendedores.',
    buttonActivity: 'Vendedores',
    link: '/vendedores',
    navText: 'Empleados',
    user: [USERS_TYPES.admin]
  },
  {
    image: clientesImg,
    titleActivity: 'Clientes',
    descriptionActivity: 'Agregar, modifica y elimina clientes',
    buttonActivity: 'Gestionar',
    link: '/clientes',
    navText: 'Clientes',
    user: [USERS_TYPES.admin]
  },
  {
    image: analizarImg,
    titleActivity: 'Analizar',
    descriptionActivity: 'Saca estadísticas de lo que necesites',
    buttonActivity: 'Analizar',
    link: '/analizar',
    navText: 'Analizar',
    user: [USERS_TYPES.admin, USERS_TYPES.vendedor, USERS_TYPES.trabajador]
  }
];

export const COLLECTIONS = {
  visitas: 'visitas',
  analizar: 'analizar',
  usersData: 'usersData',
  dynamicFields: 'dynamicFields',
  dynamicFieldsAnalisis: 'dynamicFieldsAnalisis',
  fichajeTypes: 'fichajeTypes'
};

export const CHARTS_COLORS = getColors();
