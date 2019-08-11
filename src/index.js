import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import './index.css';
var classNames = require('classnames');

function Square(props) {
    var buttonClasses = classNames({
        'square':true,
        'whiteBack':!props.isN,
        'yellowBack':props.isN
    });
    return (
      <button className = {buttonClasses} onClick={props.onClick}>
        {props.value}  
      </button>
    );
  }
  
  class Board extends React.Component {
    
    renderSquare(i,isPaint) {
      return (
        <Square 
          value = {this.props.squares[i]} 
          onClick = {()=>this.props.onClick(i)}
          isN = {isPaint}
        />
      );
    }
  
    render() {  
        var n = this.props.numRows;
        var m = this.props.numCols;
        var winData = this.props.winData;
        var colors = Array(9).fill(false);
        if( winData[0] ) {
            for( let i = 0; i < 3; i++ ) {
                colors[winData[1][i]] = true;
            }
        }
        var self = this;
        const items = [];
        for( let i = 0; i < n; i++ ) {
            const insideItems = [];
            for( let j = 0; j < m; j++ ) {
                var num = i*3+j;
                insideItems.push(self.renderSquare(num, winData[0] && colors[num]));
            }
            items.push(
                <div className = "board-row">
                    {insideItems}
                </div>
            );
        }
        return (
            <div className = "mainDiv">
                {items}
            </div>
        );
    }
  }
  
  class Game extends React.Component {
    
    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const curr = history[history.length-1];
      const squares = curr.squares.slice();
      if( calculateWinner(squares)[0] || squares[i] ) return;
      squares[i] = (this.state.xIsNext ? 'X' : 'O');
      this.setState({history:history.concat([{squares:squares,clickedAt:i}]), stepNumber:history.length, xIsNext:!this.state.xIsNext});
    }
    
    jumpTo(step) {
      this.setState({
        stepNumber:step,
        xIsNext: step%2?false:true,
      });
    }
    
    constructor(props) {
      super(props);
      this.state = {
        history:
        [
          {
            squares:Array(9).fill(null),
            clickedAt:-1,
          }
        ],
        stepNumber: 0,
        xIsNext:true,
      }
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const win = calculateWinner(current.squares);
      var winner = win[0];
      var winPlaces = null;
      const moves = history.map( (step,move) => {
        const desc = move ? "Go to move #"+move+' done at cell ['+parseInt(step.clickedAt/3)+','+step.clickedAt%3+']' : "Go to Start";
        return (
          <li key={move}>
            {/* <button onClick={()=>this.jumpTo(move)}>{desc}</button> */}
            {/* <Button variant="outline-primary" >{desc}</Button> */}
            <Button variant="dark" onClick={()=>this.jumpTo(move)}>{desc}</Button>
          </li>
        );
      }
      );
      
      let status;
      if( winner ) {
        // status = 'Winner : ' + winner;
        status = <Alert variant="danger" key={this.state.stepNumber}> 
            <Alert.Heading>{winner+' is the Winner!!!'}</Alert.Heading>
        </Alert>
        winPlaces = win[1];
      } else if( this.state.stepNumber < 9 ) {
        // status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
        var st = this.state.xIsNext ? 'warning': 'secondary';
        status = <Alert variant={st} key={this.state.stepNumber}>
            <Alert.Heading>{'Next player: '+(this.state.xIsNext ? 'X' : 'O')}</Alert.Heading>
        </Alert>
      } else {
        //   status = 'Game Draw!!'
        status = <Alert variant="danger" key={this.state.stepNumber}>
            <Alert.Heading>{'Game Draw!!'}</Alert.Heading>
        </Alert>
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}
              winData = {[winner,winPlaces]}
              numRows = {3} 
              numCols = {3}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game  />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a],lines[i]];
      }
    }
    return [null,null];
  }