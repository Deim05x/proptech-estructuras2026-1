package co.edu.uniquindio.backend.estructuras.listas.DoubleList;

import java.util.Iterator;

public class LinkedDoubleList<T extends Comparable<T>> implements Iterable<T> {
    private NodeDouble<T> first;
    private NodeDouble<T> last;
    private int size;

    public LinkedDoubleList() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    public void addFirst(T data) {
        NodeDouble<T> newNode = new NodeDouble<>(data);
        if (isEmpty()) {
            first = newNode;
            last = newNode;
        } else {
            newNode.setNext(first);
            first.setPrevious(newNode);
            first = newNode;
        }
        size++;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public void addLast(T data) {
        NodeDouble<T> newNode = new NodeDouble<>(data);
        if (isEmpty()) {
            first = newNode;
            last = newNode;
        } else {
            last.setNext(newNode);
            newNode.setPrevious(last);
            last = newNode;
        }
        size++;
    }

    public void removeFirst() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        } else {
            if (size == 1) {
                first = null;
                last = null;
            } else {
                NodeDouble<T> aux = first;
                first = first.getNext();
                first.setPrevious(null);
                aux.setNext(null);
            }
            size--;
        }
    }

    public void removeLast() {
        if (isEmpty()) {
            throw new RuntimeException("List is empty");
        } else {
            if (size == 1) {
                first = null;
                last = null;
            } else {
                NodeDouble<T> aux = last;
                last = last.getPrevious();
                last.setNext(null);
                aux.setPrevious(null);
            }
            size--;
        }
    }

    public void printList() {
        NodeDouble<T> aux = first;
        if (aux == null) {
            System.out.println("List is Empty");
        } else {
            while (aux != null) {
                System.out.println(aux.toString());
                aux = aux.getNext();
            }
        }
    }

    public void printListReverse() {
        NodeDouble<T> aux = last;
        if (aux == null) {
            System.out.println("List is Empty");
        } else {
            while (aux != null) {
                System.out.println(aux.toString());
                aux = aux.getPrevious();
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
            NodeDouble<T> newNode = new NodeDouble<>(data);
            NodeDouble<T> aux = getNodeAtPosition(index);
            newNode.setNext(aux);
            newNode.setPrevious(aux.getPrevious());
            aux.getPrevious().setNext(newNode);
            aux.setPrevious(newNode);
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
    public NodeDouble<T> getNode(int index) {
        if (!isValidIndex(index)) {
            throw new RuntimeException("Index out of bounds");
        }
        return getNodeAtPosition(index);
    }

    // Helper method: Get node at position (optimized for double linked list)
    private NodeDouble<T> getNodeAtPosition(int index) {
        NodeDouble<T> aux;
        if (index < size / 2) {
            aux = first;
            for (int i = 0; i < index; i++) {
                aux = aux.getNext();
            }
        } else {
            aux = last;
            for (int i = size - 1; i > index; i--) {
                aux = aux.getPrevious();
            }
        }
        return aux;
    }

    // Method: Get position of node by value
    public int getNodePosition(T data) {
        NodeDouble<T> aux = first;
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
            NodeDouble<T> aux = getNodeAtPosition(index);
            aux.getPrevious().setNext(aux.getNext());
            aux.getNext().setPrevious(aux.getPrevious());
            aux.setNext(null);
            aux.setPrevious(null);
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
            NodeDouble<T> aux = first;
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

    @Override
    public Iterator<T> iterator() {
        return new LinkedDoubleListIterator<>(first);
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
}
