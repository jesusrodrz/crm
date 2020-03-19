import presupuestos from '../Images/calculator.jpg';
import ventas from '../Images/sell.jpg';
import estadisticas from '../Images/estadisticas.jpg';
import trabajo from '../Images/trabajo.jpg';
import configuracion from '../Images/configuracion.jpg';
import vendedores from '../Images/vendedores.png';
import tiempos from '../Images/tiempos.jpg';

export const NAV_LINKS = [
  {
    image: ventas,
    titleActivity: 'Haz Visita',
    descriptionActivity:
      'Aquí vas a apuntar de forma rápida las visitas que estas realizando',
    buttonActivity: 'Visita',
    link: '/Visitas',
    navText: 'Visitas',
    user: ['admin', 'vendedor']
  },
  {
    image: presupuestos,
    titleActivity: 'Gestion de Visitas',
    descriptionActivity:
      'Recuerda todo el trabajo realizado y además haz un buen seguimiento',
    buttonActivity: 'Gestiona',
    link: '/gestion',
    navText: 'Gestionar Visitas',
    user: ['admin', 'vendedor']
  },
  {
    image: estadisticas,
    titleActivity: 'Estadísticas',
    descriptionActivity:
      'Analiza las visitas que estas realizando para analizar lo que consigues',
    buttonActivity: 'Analizar',
    link: '/estadisticas',
    navText: 'Estadísticas',
    user: ['admin', 'vendedor']
  },
  {
    image: trabajo,
    titleActivity: 'Fichar',
    descriptionActivity: 'Ficha tu trabajo',
    buttonActivity: 'Fichar',
    link: '/fichar',
    navText: 'Fichar',
    user: ['admin', 'vendedor']
  },
  {
    image: tiempos,
    titleActivity: 'Ver Trabajo',
    descriptionActivity: 'Visualiza el trabajo realizado',
    buttonActivity: 'Ver',
    link: '/trabajo-realizado',
    navText: 'Trabajo Realizado',
    user: ['admin', 'vendedor']
  },
  {
    image: configuracion,
    titleActivity: 'Configuración',
    descriptionActivity: 'Configuraciones Generales',
    buttonActivity: 'Configuración',
    link: '/configuracion',
    navText: 'Configuración',
    user: ['admin']
  },
  {
    image: vendedores,
    titleActivity: 'Administrar Vendedores',
    descriptionActivity: 'Agrega, modficia o eliminia vendedores.',
    buttonActivity: 'Vendedores',
    link: '/vendedores',
    navText: 'Vendedores',
    user: ['admin']
  },
  {
    image: vendedores,
    titleActivity: 'Clientes',
    descriptionActivity: 'Agregar, modifica y elimina clientes',
    buttonActivity: 'Gestionar',
    link: '/clientes',
    navText: 'Clientes',
    user: ['admin']
  }
];
