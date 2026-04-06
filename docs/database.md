# Base de Datos

## Motor

- SQL Server
- Autenticacion Windows (msnodesqlv8)

## Conexion

El backend usa:
```
server: DB_SERVER
database: DB_NAME
driver: DB_DRIVER
options.trustedConnection: DB_TRUSTED_CONNECTION
options.instanceName: DB_INSTANCE
```

## Tablas minimas esperadas

### Sensores

Campos minimos usados por el backend:
- `id_sensor`
- `nombre`
- `tipo`
- `pin`
- `unidad_medida`

### Lecturas

Campos minimos usados por el backend:
- `id_lectura`
- `id_sensor`
- `valor`
- `fecha_lectura`

## DDL sugerido (referencial)

```sql
CREATE TABLE Sensores (
  id_sensor INT IDENTITY(1,1) PRIMARY KEY,
  nombre NVARCHAR(100) NOT NULL,
  tipo NVARCHAR(100) NOT NULL,
  pin NVARCHAR(20) NOT NULL,
  unidad_medida NVARCHAR(20) NOT NULL
);

CREATE TABLE Lecturas (
  id_lectura INT IDENTITY(1,1) PRIMARY KEY,
  id_sensor INT NOT NULL,
  valor FLOAT NOT NULL,
  fecha_lectura DATETIME2 NOT NULL,
  CONSTRAINT FK_Lecturas_Sensores
    FOREIGN KEY (id_sensor) REFERENCES Sensores(id_sensor)
);
```

## Sensores por defecto

El backend crea sensores base si no existen:
- Humedad Suelo (A0, %)
- Temp Aire DHT11 (D4, °C)
- Luz (A1, raw)
- Lluvia (A2, raw)
