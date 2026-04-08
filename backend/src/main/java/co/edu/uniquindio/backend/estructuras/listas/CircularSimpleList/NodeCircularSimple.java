package co.edu.uniquindio.backend.estructuras.listas.CircularSimpleList;

public class NodeCircularSimple<T> {
  private T data;
  private NodeCircularSimple<T> next;

  public NodeCircularSimple(T data) {
    this.data = data;
    this.next = null;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }

  public NodeCircularSimple<T> getNext() {
    return next;
  }

  public void setNext(NodeCircularSimple<T> next) {
    this.next = next;
  }

  @Override
  public String toString() {
    return "Dato: " + data;
  }
}
