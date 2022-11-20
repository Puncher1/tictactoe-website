
class TicTacToe {
    constructor() {
        this.grid = [[" ", " ", " "],
                     [" ", " ", " "],
                     [" ", " ", " "]]
    }

    getCells() {
        let rows = document.getElementById("grid").rows
        let cells = []
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            for (let j = 0; j < row.cells.length; j++) {
                cells.push(row.cells[j])
            }
        }

        return cells
    }

    getPossibleFields(grid) {
        let possibleFields = []
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                let field = grid[i][j]
                if (field === " ") {
                    possibleFields.push([i, j])
                }
            }   
        }
        
        return possibleFields
    }

    getTerminationState(grid) {
        if (this.checkWinner("X", grid)) {return 10}
        else if (this.checkWinner("O", grid)) {return -10}
    }

    checkWinner(player, grid) {
        // horizontal check
        for (let i=0; i<3; i++) {
            let count_h = 0
            for (let j=0; j<3; j++) {
                let field = grid[i][j]
                if (field === player) {count_h++} 
            }
            if (count_h == 3) {return true}
        }

        // vertical check
        for (let i=0; i<3; i++) {
            let count_v = 0
            for (let j=0; j<3; j++) {
                let field = grid[j][i]
                if (field === player) {count_v++} 
            }
            if (count_v == 3) {return true}
        }

        // diagonal check 1
        let count_d = 0
        for (let i=0; i<3; i++) {
            let field = grid[i][i]
            if (field === player) {count_d++}
        }
        if (count_d == 3) {return true}
        
        // diagonal check 2
        let d = 2
        count_d = 0
        for (let i=0; i<3; i++) {
            let field = grid[d][i]
            if (field === player) {count_d++}

            d--
        }
        if (count_d == 3) {return true}

        return false
    }

    setState(state) {
        // state: -10=lose, 0=draw, 10=win

        let state_obj = document.getElementById("state")
        state_obj.className = ""
        if (state == 10) {
            state_obj.innerText = "You win!"
            state_obj.className = ""
        }
        else if (state == 0) {
            state_obj.innerText = "Draw!"
        }
        else if (state == -10) {
            state_obj.innerText = "You lose!"
        }
    }

    setPlayerMove(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = "O"
    }

    setBotMove(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = "X"
    }

    clearField(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = " "
    }

    minimax(temp_grid, isMaximizer) {
        let possibleFields = this.getPossibleFields(temp_grid)
        let state = this.getTerminationState(temp_grid)

        if (state == 10 || state == -10) {return state}
        if (possibleFields.length == 0) {return 0}
        
        if (isMaximizer) {
            let best = -1000
            for (let i=0; i < possibleFields.length; i++) {
                let possibleField = possibleFields[i]
                this.setBotMove(temp_grid, [possibleField[0], possibleField[1]])
                
                let possibleBest = this.minimax(temp_grid, !isMaximizer)
                best = Math.max.apply(null, [best, possibleBest])
                this.clearField(temp_grid, [possibleField[0], possibleField[1]])

            }
            return best
        }
        else {
            let best = 1000

            for (let i=0; i < possibleFields.length; i++) {
                let possibleField = possibleFields[i]
                this.setPlayerMove(temp_grid, [possibleField[0], possibleField[1]])

                let possibleBest = this.minimax(temp_grid, !isMaximizer)
                best = Math.min.apply(null, [best, possibleBest])
                this.clearField(temp_grid, [possibleField[0], possibleField[1]])
            }
            return best
        }

    }

    getBestField() {
        let possibleFields = this.getPossibleFields(this.grid)
        let temp_grid = JSON.parse(JSON.stringify(this.grid))

        let best_state = -1000
        let best_field
        for (let i=0; i < possibleFields.length; i++) {
            let possibleField = possibleFields[i]
            this.setBotMove(temp_grid, [possibleField[0], [possibleField[1]]])

            let state = this.minimax(temp_grid, false)
            this.clearField(temp_grid, [possibleField[0], possibleField[1]])

            if (state > best_state) {
                best_state = state
                best_field = possibleField
            }
        }
        return best_field
    }

    freezeCells() {
        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].className = ""
        }
    }

    unfreezeCells() {
        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].className = "empty"
        }
    }

    resetGame() {
        this.grid = [[" ", " ", " "],
                     [" ", " ", " "],
                     [" ", " ", " "]]

        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].innerText = " "
        }
        this.unfreezeCells()

        let state_obj = document.getElementById("state")
        state_obj.innerText = "state"
        state_obj.className = "no-state"

    }

    cellPressed(event) {
        let cell = event.currentTarget
        if (cell.className !== ""){
            cell.innerText = "O"
            cell.className = ""
            let colIndex = cell.cellIndex
            let rowIndex = cell.parentNode.rowIndex

            this.setPlayerMove(this.grid, [rowIndex, colIndex])
            let isPlayerWin = this.checkWinner("O", this.grid)
            if (isPlayerWin) {
                this.setState(10)
                this.freezeCells()
            }
            else {
                let possibleFields = this.getPossibleFields(this.grid)
                if (possibleFields.length == 0) {
                    this.setState(0)
                    this.freezeCells()
                }
                else {
                    let difficulty = document.getElementById("difficulty-select").innerText
                    console.log(difficulty)

                    let botField
                    if (difficulty == "Easy") {

                    }
                    else if (difficulty == "Medium") {

                    }
                    else if (difficulty == "Impossible") {
                        botField = this.getBestField()
                    }

                    this.setBotMove(this.grid, [botField[0], botField[1]])

                    let botCell = document.getElementById("" + botField[0] + botField[1])
                    botCell.innerText = "X"
                    botCell.className = ""

                    let isBotWin = this.checkWinner("X", this.grid)
                    if (isBotWin) {
                        this.setState(-10)
                        this.freezeCells()
                    }
                }
            }

        }

    }

}

function addCellClickListener(cells, ttt) {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function(event){ttt.cellPressed(event)}, false)
    }

}

function load() {
    let ttt = new TicTacToe()
    let cells = ttt.getCells()
    addCellClickListener(cells, ttt)

    document.getElementById("btn-restart")
        .addEventListener("click", function(){ttt.resetGame()}, false)
    document.getElementById("difficulty-select")
        .addEventListener("change", function(){ttt.resetGame()}, false)
}

window.onload = load