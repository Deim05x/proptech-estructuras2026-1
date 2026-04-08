package co.edu.uniquindio.backend.estructuras.listas.SimpleList;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class LinkedSimpleListIterator<T extends Comparable<T>> implements Iterator<T> {
    private Node<T> current;

    public LinkedSimpleListIterator(Node<T> first) {
        this.current = first;
    }

    @Override
    public boolean hasNext() {
        return current != null;
    }

    @Override
    public T next() {
        if (!hasNext()) {
            throw new NoSuchElementException("No more elements in the list");
        }

        T data = current.getData();
        current = current.getNext();
        return data;
    }
}
