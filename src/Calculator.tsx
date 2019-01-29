import React, { useState, FunctionComponent } from "react";

const styles = {
  row: {
    display: "flex"
  },
  number: {
    height: 30,
    width: 30,
    margin: 10,
    cursor: "pointer"
  }
};

const Calculator: FunctionComponent = (): JSX.Element => {
  const [input, setInput] = useState<string>("");
  function addNumber(num: number) {
    setInput(input.length === 0 ? `${num}` : `${input}${num}`);
  }
  function addOperator(operator: string) {
    if (input.length === 0) {
      setInput(`0${operator}`);
    } else {
      if (getLastEnteredOperatorPosition() === input.length - 1) {
        if (operator === ".") {
          setInput(`${input}0${operator}`);
        } else {
          setInput(`${input.substr(0, input.length - 1)}${operator}`);
        }
      } else {
        setInput(`${input}${operator}`);
      }
    }
  }
  function clearInput() {
    setInput(``);
  }
  function getLastEnteredOperatorPosition(): number {
    const operators = ["+", "-", "*", "/"];
    let lastOperatorIndex = input
      .split("")
      .reduce(
        (lastIndex: number, i, j) => (operators.includes(i) ? j : lastIndex),
        0
      );
    operators.forEach(i => {
      lastOperatorIndex =
        input.indexOf(i, lastOperatorIndex) > -1
          ? input.indexOf(i, lastOperatorIndex)
          : lastOperatorIndex;
    });
    return lastOperatorIndex;
  }
  function invertSign() {
    let lastEnteredOperatorPosition: number = getLastEnteredOperatorPosition();
    if (input.length > 0 && lastEnteredOperatorPosition === 0) {
      setInput(input[0] !== "-" ? `-${input}` : `${input.substr(1)}`);
    }
  }
  function roundToDecimal(floatNum: number, decimalPlaces: number = 5): number {
    const denominator: number = Math.pow(10, decimalPlaces);
    return Math.floor(floatNum * denominator) / denominator;
  }
  function getResults() {
    function convertToFloat(num: string): number {
      if (num.substr(0, 1) === "-") {
        return 0 - parseFloat(num.substr(1));
      } else {
        return parseFloat(num);
      }
    }
    function performOperation(
      leftNumber: string,
      rightNumber: string,
      operator: string
    ): string {
      const firstNumber: number = convertToFloat(leftNumber);
      const lastNumber: number = convertToFloat(rightNumber);
      let result = 0;
      switch (operator) {
        case "+":
          result = firstNumber + lastNumber;
          break;
        case "/":
          result = firstNumber / lastNumber;
          break;
        case "*":
          result = firstNumber * lastNumber;
          break;
        case "-":
          result = firstNumber - lastNumber;
          break;
        default:
          result = firstNumber;
          break;
      }
      return result.toString();
    }

    if (getLastEnteredOperatorPosition() !== input.length - 1) {
      const operators = ["+", "-", "*", "/"];
      //adding 0 to take care of negative elements
      let operations: Array<string> = `0${input}`
        .split("")
        .reduce((arr: Array<string>, i) => {
          if (operators.includes(i)) {
            return arr.concat(i);
          } else {
            if (arr.length > 0) {
              if (operators.includes(arr.slice(-1)[0])) {
                return arr.concat(i);
              } else {
                return [...arr.slice(0, -1), `${arr.slice(-1)[0]}${i}`];
              }
            } else {
              return arr.concat(i);
            }
          }
        }, []);

      while (operations.length > 1) {
        operations[0] = performOperation(
          operations[0],
          operations[2],
          operations[1]
        );
        operations = [operations[0], ...operations.slice(3)];
      }
      let result: number = roundToDecimal(parseFloat(operations[0]));
      setInput(result.toString());
    }
  }
  function takePercent() {
    let lastEnteredOperatorPosition: number = getLastEnteredOperatorPosition();
    console.log(lastEnteredOperatorPosition);
    if (input.length > 0 && lastEnteredOperatorPosition === 0) {
      setInput(
        input[0] !== "-"
          ? `-${roundToDecimal(parseFloat(input), 2)}`
          : `${roundToDecimal(parseFloat(input.substr(1)), 2)}`
      );
    }
  }
  return (
    <div>
      <div>
        <div style={styles.row}>{input}</div>
        <div>
          <div style={styles.row}>
            <div style={styles.number} onClick={clearInput}>
              AC
            </div>
            <div
              style={
                getLastEnteredOperatorPosition() > 0
                  ? { ...styles.number, color: "gray" }
                  : styles.number
              }
              onClick={takePercent}
            >
              %
            </div>
            <div
              style={
                getLastEnteredOperatorPosition() > 0
                  ? { ...styles.number, color: "gray" }
                  : styles.number
              }
              onClick={invertSign}
            >
              +/-
            </div>
            <div style={styles.number} onClick={() => addOperator("/")}>
              /
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.number} onClick={() => addNumber(7)}>
              7
            </div>
            <div style={styles.number} onClick={() => addNumber(8)}>
              8
            </div>
            <div style={styles.number} onClick={() => addNumber(9)}>
              9
            </div>
            <div style={styles.number} onClick={() => addOperator("*")}>
              X
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.number} onClick={() => addNumber(4)}>
              4
            </div>
            <div style={styles.number} onClick={() => addNumber(5)}>
              5
            </div>
            <div style={styles.number} onClick={() => addNumber(6)}>
              6
            </div>
            <div style={styles.number} onClick={() => addOperator("-")}>
              -
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.number} onClick={() => addNumber(1)}>
              1
            </div>
            <div style={styles.number} onClick={() => addNumber(2)}>
              2
            </div>
            <div style={styles.number} onClick={() => addNumber(3)}>
              3
            </div>
            <div style={styles.number} onClick={() => addOperator("+")}>
              +
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.number} onClick={() => addNumber(0)}>
              0
            </div>
            <div style={styles.number} onClick={() => addOperator(".")}>
              .
            </div>
            <div style={styles.number} onClick={getResults}>
              =
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
