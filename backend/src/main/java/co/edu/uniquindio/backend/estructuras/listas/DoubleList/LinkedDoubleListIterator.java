package co.edu.uniquindio.backend.estructuras.listas.DoubleList;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class LinkedDoubleListIterator<T extends Comparable<T>> implements Iterator<T> {
    private NodeDouble<T> current;

    public LinkedDoubleListIterator(NodeDouble<T> first) {
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
