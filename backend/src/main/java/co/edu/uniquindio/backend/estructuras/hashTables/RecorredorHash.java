package co.edu.uniquindio.backend.estructuras.hashTables;

/**
 * Interfaz funcional propia para recorrer una tabla hash genérica.
 *
 * @param <K> Tipo de la clave
 * @param <V> Tipo del valor
 */
@FunctionalInterface
public interface RecorredorHash<K, V> {

    void procesar(K clave, V valor);
}