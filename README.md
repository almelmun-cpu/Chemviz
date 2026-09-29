# ChemViz ⚗️

**Visualizador Molecular Interactivo**

Aplicacion web para buscar y visualizar moleculas quimicas en 2D y 3D. Utiliza la API de [PubChem](https://pubchem.ncbi.nlm.nih.gov/) para obtener datos de compuestos quimicos y [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) para el renderizado 3D interactivo.

## Funcionalidades

- **Busqueda de moleculas** por nombre comun (aspirin, caffeine, water, ethanol, etc.)
- **Informacion detallada**: Nombre IUPAC, formula molecular, peso molecular, SMILES
- **Estructura 2D**: Visualizacion de la molecula en 2D via PubChem
- **Estructura 3D interactiva**: Modelo 3D con atomos y enlaces, rotable y escalable con el raton
- **Composicion elemental**: Lista de elementos con cantidad de atomos y porcentaje
- **Historial de busquedas**: Las ultimas 10 busquedas se guardan localmente
- **Diseno responsive**: Funciona en desktop y dispositivos moviles
- **Temas cientificos**: Colores CPK para elementos, paleta azul/verde/blanco

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 18 + Vite |
| 3D | React Three Fiber + Three.js + Drei |
| Backend | Node.js + Express |
| API externa | PubChem REST API |
| Testing | Jest (server) + Vitest (client) |
| Estilos | CSS moderno con variables |

## Estructura del Proyecto

```
ChemViz/
  package.json          # Scripts raiz (start, test, build)
  server/
    index.js            # Servidor Express (proxy API)
    services/
      pubchem.js        # Servicio de integracion con PubChem
  client/
    index.html          # HTML entry point
    vite.config.js      # Configuracion de Vite
    src/
      main.jsx          # Entry point React
      App.jsx           # Componente principal
      App.css           # Estilos del layout
      index.css         # Estilos base y variables CSS
      services/
        api.js          # Cliente HTTP para el backend
      hooks/
        useMolecule.js  # Hook personalizado para busqueda
      components/
        SearchBar.jsx / .css
        MoleculeInfo.jsx / .css
        Structure2D.jsx / .css
        Structure3D.jsx / .css
        ElementList.jsx / .css
        SearchHistory.jsx / .css
        ErrorMessage.jsx / .css
  tests/
    server.test.js      # Tests del servidor
    client.test.jsx     # Tests del cliente
```

## Instalacion y Ejecucion

```bash
# 1. Ir al directorio del proyecto
cd ChemViz

# 2. Instalar dependencias (raiz, server y client)
npm install

# 3. Iniciar la aplicacion (servidor + cliente simultaneamente)
npm start
```

Esto iniciara:
- **Servidor API** en `http://localhost:3001`
- **Cliente React** en `http://localhost:5173`

Abre tu navegador en `http://localhost:5173` y comienza a buscar moleculas.

## Ejemplos de Moleculas

| Nombre | Formula | CID |
|--------|---------|-----|
| Water | H2O | 962 |
| Aspirin | C9H8O4 | 2244 |
| Caffeine | C8H10N4O2 | 2519 |
| Ethanol | C2H6O | 702 |
| Penicillin | C16H18N2O4S | 5904 |
| Benzene | C6H6 | 241 |
| Glucose | C6H12O6 | 5793 |

## Ejecutar Tests

```bash
# Tests del servidor
npm test

# Tests del cliente
npm --prefix client test
```

## API Endpoints

| Endpoint | Descripcion |
|----------|-------------|
| `GET /api/molecule/:name` | Busca una molecula por nombre |
| `GET /api/health` | Health check del servidor |

## Despliegue en Produccion

```bash
# Construir el frontend
npm run build

# Iniciar servidor (sirve archivos estaticos + API)
npm run server
```

## Licencia

MIT
