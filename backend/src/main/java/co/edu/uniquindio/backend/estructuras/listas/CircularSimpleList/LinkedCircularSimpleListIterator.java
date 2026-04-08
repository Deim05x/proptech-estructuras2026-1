package co.edu.uniquindio.backend.estructuras.listas.CircularSimpleList;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class LinkedCircularSimpleListIterator<T extends Comparable<T>> implements Iterator<T> {
    private NodeCircularSimple<T> current;
    private int count;
    private int size;

    public LinkedCircularSimpleListIterator(NodeCircularSimple<T> first, int size) {
        this.current = first;
        this.size = size;
        this.count = 0;
    }

    @Override
    public boolean hasNext() {
        return count < size;
    }

    @Override
    public T next() {
        if (!hasNext()) {
            throw new NoSuchElementException("No more elements in the list");
        }

        T data = current.getData();
        current = current.getNext();
        count++;
        return data;
    }
}
