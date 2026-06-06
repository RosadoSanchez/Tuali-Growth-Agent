# Tuali Growth Agent 🚀

Réplica de la app móvil **Tuali** (Arca Continental) en **React Native + Expo**,
base para construir el **Agente de Crecimiento** del hackathon.

> Reto: diseñar un agente que ayude a los clientes de Tuali (tienditas /
> abarrotes) a **crecer su negocio**: recibir recomendaciones personalizadas,
> dar seguimiento al avance y aprender qué funcionó.

## ✨ Qué incluye esta entrega

Réplica funcional de la app con datos mock:

- **Inicio**: buscador, marcas, banner de loyalty (puntos Gana), carrusel de
  promociones, "Vuelve a surtir" y "Más vendidos en tu zona".
- **Categorías**: grid de categorías con filtro de productos y búsqueda.
- **Carrito**: edición de cantidades, resumen y checkout (estado global).
- **Pedidos**: historial agrupado por mes con filtros por estatus.
- **Perfil**: datos de la tienda, puntos, ticket promedio y ventas del mes.
- **Detalle de producto**: presentación, precio, puntos loyalty y relacionados.
- **🌱 Agente de Crecimiento** (`/growth`): metas con progreso, acciones
  recomendadas con impacto estimado, feedback (👍/👎 "aprender y ajustar") y
  un punto de entrada para chat/voz (listo para conectar Gemini + ElevenLabs).

## 🛠️ Stack

- **Expo SDK 56** (React Native 0.85, React 19)
- **expo-router** (navegación basada en archivos)
- **TypeScript**
- `expo-linear-gradient`, `@expo/vector-icons`, `react-native-safe-area-context`

## ▶️ Cómo correrlo

```bash
npm install
npx expo start
```

Luego:
- Escanea el QR con la app **Expo Go** en tu celular (iOS/Android), o
- Presiona `i` (simulador iOS) / `a` (emulador Android), o
- `w` para abrir en web.

> Es solo móvil: el diseño está pensado para celular.

## 📁 Estructura

```
app/
  _layout.tsx           # Stack raíz + providers (carrito)
  (tabs)/
    _layout.tsx         # Tab bar custom (carrito central elevado)
    index.tsx           # Inicio
    categorias.tsx
    carrito.tsx
    pedidos.tsx
    perfil.tsx
  producto/[id].tsx     # Detalle de producto
  growth.tsx            # 🌱 Agente de Crecimiento
components/             # UI reutilizable (ProductCard, PromoCarousel, etc.)
constants/              # theme.ts (paleta de marca) + formato
context/                # CartContext (estado global del carrito)
data/                   # Datos mock (catálogo, pedidos, tienda, agente)
```

## 🧭 Siguiente paso (arquitectura propuesta del agente)

- **Frontend**: esta app (React Native / Expo).
- **Backend**: MongoDB Atlas (perfil de tienda, historial, metas, feedback).
- **IA**: Gemini API para razonar recomendaciones a partir del contexto del
  negocio (historial, promos, loyalty, pedido sugerido).
- **Voz**: ElevenLabs para el agente conversacional.

La pantalla `app/growth.tsx` y los datos en `data/store.ts`
(`growthGoals`, `recommendations`) están aislados para reemplazar fácilmente
los mocks por llamadas reales al backend/IA.

---
Demo de hackathon · Tuali × Arca Continental.
