package co.edu.uniquindio.backend.estructuras.listas.CircularDoubleList;

public class NodeCircularDouble<T> {
  private T data;
  private NodeCircularDouble<T> next;
  private NodeCircularDouble<T> previous;

  public NodeCircularDouble(T data) {
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

  public NodeCircularDouble<T> getNext() {
    return next;
  }

  public void setNext(NodeCircularDouble<T> next) {
    this.next = next;
  }

  public NodeCircularDouble<T> getPrevious() {
    return previous;
  }

  public void setPrevious(NodeCircularDouble<T> previous) {
    this.previous = previous;
  }

  @Override
  public String toString() {
    return "Dato: " + data;
  }
}
