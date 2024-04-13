
interface StatusConfig {
  names: Record<string, string>;
  colors: Record<string, string>;
}

export const entityStatusConfig: Record<string, StatusConfig> = {
  taskInstances: {
    names: {
      PENDING: 'Pendiente',
      CANCELLED: 'Cancelada',
      FINISHED: 'Finalizada',
    },
    colors: {
      PENDING: 'bg-hg-black500',
      CANCELLED: 'bg-hg-error',
      FINISHED: 'bg-hg-green',
    },
  }, 
  WORKORDER:{
    names: {
      Preventive: 'En Curs',
      Corrective: 'En Espera',
      Predictive: 'Finalitzada',
    },
    colors: {
      "1": 'bg-okron-preventive',
      "0": 'bg-okron-corrective',
      "2": 'bg-okron-btDetail',
    }
  },
  WORKORDERSTATE:{
    names: {
      Preventive: 'En Curs',
      Corrective: 'En Espera',
      Predictive: 'Finalitzada',
    },
    colors: {
      "1": 'bg-okron-preventive',
      "0": 'bg-okron-waiting',
      "2": 'bg-okron-btDetail',
      "3": 'bg-okron-finished',
    }
  }
};


