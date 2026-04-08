package co.edu.uniquindio.backend.estructuras.listas.CircularSimpleList;

import java.util.Iterator;

public class LinkedCircularSimpleList<T extends Comparable<T>> implements Iterable<T> {
    private NodeCircularSimple<T> first;
    private NodeCircularSimple<T> last;
    private int size;

    public LinkedCircularSimpleList() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    public void addFirst(T data) {
        NodeCircularSimple<T> newNode = new NodeCircularSimple<>(data);
        if (isEmpty()) {
            first = newNode;
            last = newNode;
            newNode.setNext(first);
        } else {
            newNode.setNext(first);
            last.setNext(newNode);
            first = newNode;
        }
        size++;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public void addLast(T data) {
        NodeCircularSimple<T> newNode = new NodeCircularSimple<>(data);
        if (isEmpty()) {
            first = newNode;
            last = newNode;
            newNode.setNext(first);
        } else {
            last.setNext(newNode);
            newNode.setNext(first);
            last = newNode;
        }
        size++;
    }

    public void removeFirst() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        } else if (size == 1) {
            first = null;
            last = null;
        } else {
            NodeCircularSimple<T> aux = first;
            first = first.getNext();
            last.setNext(first);
            aux.setNext(null);
        }
        size--;
    }

    public void removeLast() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        } else if (size == 1) {
            first = null;
            last = null;
        } else {
            NodeCircularSimple<T> aux = first;
            while (aux.getNext() != last) {
                aux = aux.getNext();
            }
            last = aux;
            last.setNext(first);
        }
        size--;
    }

    public void printList() {
        if (isEmpty()) {
            System.out.println("List is Empty");
        } else {
            NodeCircularSimple<T> aux = first;
            for (int i = 0; i < size; i++) {
                System.out.println(aux.toString());
                aux = aux.getNext();
            }
        }
    }

    // Method: Validate index
    public boolean isValidIndex(int index) {
        return index >= 0 && index < size;
    }

    // Method: Add at specific position
    public void add(int index, T data) {
        if (!isValidIndex(index) && index != size) {
            throw new RuntimeException("Index out of bounds");
        }
        if (index == 0) {
            addFirst(data);
        } else if (index == size) {
            addLast(data);
        } else {
            NodeCircularSimple<T> newNode = new NodeCircularSimple<>(data);
            NodeCircularSimple<T> aux = getNodeAtPosition(index - 1);
            newNode.setNext(aux.getNext());
            aux.setNext(newNode);
            size++;
        }
    }

    // Method: Get node value at position
    public T getNodeValue(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        return getNodeAtPosition(index).getData();
    }

    // Method: Get node at position
    public NodeCircularSimple<T> getNode(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        return getNodeAtPosition(index);
    }

    // Helper method: Get node at position
    private NodeCircularSimple<T> getNodeAtPosition(int index) {
        NodeCircularSimple<T> aux = first;
        for (int i = 0; i < index; i++) {
            aux = aux.getNext();
        }
        return aux;
    }

    // Method: Get position of node by value
    public int getNodePosition(T data) {
        NodeCircularSimple<T> aux = first;
        for (int i = 0; i < size; i++) {
            if (aux.getData().equals(data)) {
                return i;
            }
            aux = aux.getNext();
        }
        return -1; // Not found
    }

    // Method: Remove node by value
    public void removeData(T data) {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        }
        int index = getNodePosition(data);
        if (index == -1) {
            throw new RuntimeException("Element not found");
        }
        removeAtIndex(index);
    }

    // Method: Remove node at specific position
    private void removeAtIndex(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        if (index == 0) {
            removeFirst();
        } else if (index == size - 1) {
            removeLast();
        } else {
            NodeCircularSimple<T> aux = getNodeAtPosition(index - 1);
            aux.setNext(aux.getNext().getNext());
            size--;
        }
    }

    // Method: Modify node value at position
    public void modifyNode(int index, T newData) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        getNodeAtPosition(index).setData(newData);
    }

    // Method: Sort list (bubble sort)
    public void sortList() {
        if (isEmpty() || size == 1) {
            return;
        }
        for (int i = 0; i < size - 1; i++) {
            NodeCircularSimple<T> aux = first;
            for (int j = 0; j < size - i - 1; j++) {
                if (aux.getData().compareTo(aux.getNext().getData()) > 0) {
                    // Swap data
                    T temp = aux.getData();
                    aux.setData(aux.getNext().getData());
                    aux.getNext().setData(temp);
                }
                aux = aux.getNext();
            }
        }
    }

    // Method: Get list size
    public int getSize() {
        return size;
    }

    // Method: Clear entire list
    public void clearList() {
        while (!isEmpty()) {
            removeFirst();
        }
    }

    // Method: Remove by index
    public void removeByIndex(int index) {
        if (isEmpty()) {
            throw new RuntimeException("List is Empty");
        } else if (index == 0) {
            removeFirst();
            return;
        }
        if (index == size - 1) {
            removeLast();
            return;
        }
        if (isValidIndex(index)) {
            removeAtIndex(index);
        }
    }

    @Override
    public Iterator<T> iterator() {
        return new LinkedCircularSimpleListIterator<>(first, size);
    }
}