package co.edu.uniquindio.backend.estructuras.listas.DoubleList;

public class NodeDouble<T> {
  private T data;
  private NodeDouble<T> next;
  private NodeDouble<T> previous;

  public NodeDouble(T data) {
    this.data = data;
    this.next = null;
    this.previous = null;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }

  public NodeDouble<T> getNext() {
    return next;
  }

  public void setNext(NodeDouble<T> next) {
    this.next = next;
  }

  public NodeDouble<T> getPrevious() {
    return previous;
  }

  public void setPrevious(NodeDouble<T> previous) {
    this.previous = previous;
  }

  @Override
  public String toString() {
    return "Dato: " + data;
  }
}
