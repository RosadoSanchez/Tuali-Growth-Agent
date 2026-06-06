// Datos de la tienda / protopersona (cliente Tuali)
export const store = {
  name: 'Abarrotes Chabela',
  owner: 'Isabel Ramírez',
  location: 'Col. Centro, Monterrey',
  points: 1240,
  level: 'Tendero Plata',
  ticketPromedio: 412,
  ventasMes: 18450,
  metaMensual: 25000,
};

// Datos mock para el Growth Agent (el reto del hackathon)
export type GrowthGoal = {
  id: string;
  title: string;
  metric: string;
  current: number;
  target: number;
  unit: string;
};

export const growthGoals: GrowthGoal[] = [
  {
    id: 'g1',
    title: 'Aumentar ventas del mes',
    metric: 'Ventas',
    current: 18450,
    target: 25000,
    unit: '$',
  },
  {
    id: 'g2',
    title: 'Subir ticket promedio',
    metric: 'Ticket promedio',
    current: 412,
    target: 500,
    unit: '$',
  },
];

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  impact: string;
  action: string;
  icon: string;
  type: 'promo' | 'reorder' | 'loyalty' | 'mix';
};

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    title: 'Surte Coca-Cola 1.5L antes del fin de semana',
    reason: 'Tu producto más vendido y se te agota cada viernes.',
    impact: '+$640 estimado',
    action: 'Agregar al pedido',
    icon: '🥤',
    type: 'reorder',
  },
  {
    id: 'r2',
    title: 'Activa la promo 20% en Ciel 1.5L',
    reason: 'En tu zona el agua sube 35% en temporada de calor.',
    impact: '+8% en ticket',
    action: 'Activar promoción',
    icon: '💧',
    type: 'promo',
  },
  {
    id: 'r3',
    title: 'Canjea tus 1,240 puntos en Bokados',
    reason: 'Las botanas elevan el ticket en compras de refresco.',
    impact: '+$180 estimado',
    action: 'Ver loyalty',
    icon: '🍿',
    type: 'loyalty',
  },
  {
    id: 'r4',
    title: 'Combo sugerido: Refresco + Botana + Agua',
    reason: 'Tus clientes compran estos productos juntos el 62% de las veces.',
    impact: '+12% ticket promedio',
    action: 'Crear combo',
    icon: '🧺',
    type: 'mix',
  },
];
