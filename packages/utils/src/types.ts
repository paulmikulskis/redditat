
// This Result class is a simple utility that allows you to represent 
// the result of an operation that may either succeed or fail. It has three fields:
//    ok: A boolean indicating whether the operation succeeded or failed.
//    result: The result of the operation, if it succeeded.
//    error: The error message or object, if the operation failed.
// Wrap the result of asynchronous operations that may either succeed or fail.
export class Result<T, E> {
  ok: boolean
  result?: T
  error?: E

  constructor(ok: boolean, result?: T, error?: E) {
    this.ok = ok
    this.result = result
    this.error = error
  }
}


