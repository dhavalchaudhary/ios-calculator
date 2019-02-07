import React, { useState, FunctionComponent } from "react";
import styled from "@emotion/styled";

const Row = styled.div`
  display: flex;
`;

interface ButtonProps {
  horizontallyExtended?: boolean;
  primaryOperator?: boolean;
  secondaryOperator?: boolean;
}

const Button = styled.div`
  height: 60px;
  width: ${(props: ButtonProps) => (props.horizontallyExtended ? 132 : 60)}px;
  margin: 5px;
  cursor: pointer;
  border: 0px;
  border-radius: ${(props: ButtonProps) =>
    props.horizontallyExtended ? "35px" : "100%"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: ${props =>
    props.primaryOperator || props.secondaryOperator ? 26 : 22}px;
  line-height: 1.25;
  color: #ffffff;
  background: ${(props: ButtonProps) =>
    props.primaryOperator
      ? "#ffa000"
      : props.secondaryOperator
      ? "#cccccc"
      : "#464B4e"};
})`;

const InputScreen = styled.div`
  height: 60px;
  font-size: 44px;
  line-height: 1.25;
  padding: 10px;
  width: calc(100% - 20px);
  overflow-x: scroll;
  text-align: right;
  color: #ffffff;
`;

const Container = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px auto;
  background: #000000;
  border-radius: 5px;
`;

type OperatorType = "+" | "-" | "×" | "÷";

const Calculator: FunctionComponent = (): JSX.Element => {
  const [input, setInput] = useState<string>("");
  function addNumber(num: number) {
    setInput(input.length === 0 ? `${num}` : `${input}${num}`);
  }
  function addOperator(operator: string, displayValue?: string) {
    let operatorValueToDisplay = displayValue ? displayValue : operator;
    if (input.length === 0) {
      setInput(`0${operatorValueToDisplay}`);
    } else {
      if (
        input.length > 1 &&
        getLastEnteredOperatorPosition() === input.length - 1
      ) {
        if (operator === ".") {
          setInput(`${input}0${operatorValueToDisplay}`);
        } else {
          setInput(
            `${input.substr(0, input.length - 1)}${operatorValueToDisplay}`
          );
        }
      } else {
        setInput(`${input}${operatorValueToDisplay}`);
      }
    }
  }
  function clearInput() {
    setInput(``);
  }
  function getLastEnteredOperatorPosition(): number {
    const operators = ["+", "-", "×", "÷"];
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
    debugger;
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
        case "÷":
          result = firstNumber / lastNumber;
          break;
        case "×":
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
      const operators = ["+", "-", "×", "÷"];
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
        input[0] === "-"
          ? `-${roundToDecimal(parseFloat(input.substr(1)), 2)}`
          : `${roundToDecimal(parseFloat(input) / 100, 2)}`
      );
    }
  }
  return (
    <div>
      <Container>
        <InputScreen>{input}</InputScreen>
        <div>
          <Row>
            <Button onClick={clearInput} secondaryOperator>
              C
            </Button>
            <Button
              style={
                getLastEnteredOperatorPosition() > 0 ? { color: "gray" } : {}
              }
              onClick={takePercent}
              secondaryOperator
            >
              %
            </Button>
            <Button
              style={
                getLastEnteredOperatorPosition() > 0 ? { color: "gray" } : {}
              }
              onClick={invertSign}
              secondaryOperator
            >
              +/-
            </Button>
            <Button onClick={() => addOperator("/", "÷")} primaryOperator>
              ÷
            </Button>
          </Row>
          <Row>
            <Button onClick={() => addNumber(7)}>7</Button>
            <Button onClick={() => addNumber(8)}>8</Button>
            <Button onClick={() => addNumber(9)}>9</Button>
            <Button onClick={() => addOperator("×")} primaryOperator>
              ×
            </Button>
          </Row>
          <Row>
            <Button onClick={() => addNumber(4)}>4</Button>
            <Button onClick={() => addNumber(5)}>5</Button>
            <Button onClick={() => addNumber(6)}>6</Button>
            <Button onClick={() => addOperator("-")} primaryOperator>
              -
            </Button>
          </Row>
          <Row>
            <Button onClick={() => addNumber(1)}>1</Button>
            <Button onClick={() => addNumber(2)}>2</Button>
            <Button onClick={() => addNumber(3)}>3</Button>
            <Button onClick={() => addOperator("+")} primaryOperator>
              +
            </Button>
          </Row>
          <Row>
            <Button onClick={() => addNumber(0)} horizontallyExtended>
              0
            </Button>
            <Button onClick={() => addOperator(".")}>.</Button>
            <Button onClick={getResults} primaryOperator>
              =
            </Button>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Calculator;
