package co.edu.uniquindio.backend.estructuras.listas.SimpleList;

import java.util.Iterator;

public class LinkedSimpleList<T extends Comparable<T>> implements Iterable<T> {
    private Node<T> first;
    private int size;

    public LinkedSimpleList() {
        this.first = null;
        this.size = 0;
    }

    public void addFirst(T data) {
        Node<T> newNode = new Node<>(data);
        if (isEmpty()) {
            first = newNode;
        } else {
            newNode.setNext(first);
            first = newNode;
        }
        size++;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public void addLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (isEmpty()) {
            first = newNode;
        } else {
            Node<T> aux = first;
            while (aux.getNext() != null) {
                aux = aux.getNext();
            }
            aux.setNext(newNode);
        }
        size++;
    }

    public void removeFirst() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        }

        Node<T> aux = first;
        first = first.getNext();
        aux.setNext(null);
        size--;
    }

    public void removeLast() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        }

        if (size == 1) {
            first = null;
            size--;
            return;
        }

        Node<T> aux = first;
        while (aux.getNext().getNext() != null) {
            aux = aux.getNext();
        }
        aux.setNext(null);
        size--;
    }

    public void printList() {
        Node<T> aux = first;
        if (aux == null) {
            System.out.println("List is Empty");
        } else {
            while (aux != null) {
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
            Node<T> newNode = new Node<>(data);
            Node<T> aux = first;
            for (int i = 0; i < index - 1; i++) {
                aux = aux.getNext();
            }
            newNode.setNext(aux.getNext());
            aux.setNext(newNode);
            size++;
        }
    }

    // Method: Add node at given position
    public void addNodeAtPosition(int index, T data) {
        if (index < 0 || index > size) {
            throw new RuntimeException("Index out of bounds");
        }

        if (index == 0) {
            addFirst(data);
            return;
        }

        Node<T> newNode = new Node<>(data);
        Node<T> aux = first;
        for (int i = 0; i < index - 1; i++) {
            aux = aux.getNext();
        }
        newNode.setNext(aux.getNext());
        aux.setNext(newNode);
        size++;
    }

    // Method: Get node value at position
    public T getNodeValue(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        Node<T> aux = first;
        for (int i = 0; i < index; i++) {
            aux = aux.getNext();
        }
        return aux.getData();
    }

    // Method: Get node at position
    public Node<T> getNode(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        Node<T> aux = first;
        for (int i = 0; i < index; i++) {
            aux = aux.getNext();
        }
        return aux;
    }

    // Method: Get position of node by value
    public int getNodePosition(T data) {
        Node<T> aux = first;
        int index = 0;
        while (aux != null) {
            if (aux.getData().equals(data)) {
                return index;
            }
            aux = aux.getNext();
            index++;
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
            Node<T> aux = first;
            for (int i = 0; i < index - 1; i++) {
                aux = aux.getNext();
            }
            aux.setNext(aux.getNext().getNext());
            size--;
        }
    }

    // Method: Modify node value at position
    public void modifyNode(int index, T newData) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        Node<T> aux = first;
        for (int i = 0; i < index; i++) {
            aux = aux.getNext();
        }
        aux.setData(newData);
    }

    // Method: Sort list (bubble sort)
    public void sortList() {
        if (isEmpty() || size == 1) {
            return;
        }
        for (int i = 0; i < size - 1; i++) {
            Node<T> aux = first;
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
            Node<T> aux = first;
            for (int i = 0; i < index - 1; i++) {
                aux = aux.getNext();
            }
            aux.setNext(aux.getNext().getNext());
            size--;
        }
    }

    // Method: Reverse list in-place
    public void reverse() {
        Node<T> previous = null;
        Node<T> current = first;

        while (current != null) {
            Node<T> next = current.getNext();
            current.setNext(previous);
            previous = current;
            current = next;
        }

        first = previous;
    }

    @Override
    public Iterator<T> iterator() {
        return new LinkedSimpleListIterator<>(first);
    }

   
}
