
class TicTacToe {

    constructor() {
        this.grid = [[" ", " ", " "],
                     [" ", " ", " "],
                     [" ", " ", " "]]
    }

    /**
     * Returns every cell of the grid.
     * @returns {Array[Element]}  The array of cells in grid
     */
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

    /**
     * Returns an array of every possible field of the grid.
     * @param grid {Array[string]} The tic-tac-toe grid
     * @returns {Array[Array[number]]} All possible fields, which can be used
     */
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

    /**
     * Returns the termination state (win, draw, lose).
     * @param grid {Array[string]} The tic-tac-toe grid
     * @returns {number} The state number (10=win, 0=draw, -10=lose)
     */
    getTerminationState(grid) {
        if (this.checkWinner("X", grid)) {return 10}
        else if (this.checkWinner("O", grid)) {return -10}
    }

    /**
     * Checks if a player wins or not.
     * @param player {string} The player string (`O` or `X`)
     * @param grid {Array[string]} The tic-tac-toe grid
     * @returns {boolean} Whether the player wins or not
     */
    checkWinner(player, grid) {
        // horizontal check
        for (let i=0; i<3; i++) {
            let countH = 0
            for (let j=0; j<3; j++) {
                let field = grid[i][j]
                if (field === player) {countH++}
            }
            if (countH == 3) {return true}
        }

        // vertical check
        for (let i=0; i<3; i++) {
            let countV = 0
            for (let j=0; j<3; j++) {
                let field = grid[j][i]
                if (field === player) {countV++}
            }
            if (countV == 3) {return true}
        }

        // diagonal check 1
        let countD = 0
        for (let i=0; i<3; i++) {
            let field = grid[i][i]
            if (field === player) {countD++}
        }
        if (countD == 3) {return true}
        
        // diagonal check 2
        let d = 2
        countD = 0
        for (let i=0; i<3; i++) {
            let field = grid[d][i]
            if (field === player) {countD++}

            d--
        }
        if (countD == 3) {return true}

        return false
    }

    /**
     * Sets the state text above the tic-tac-toe grid.
     * @param state {number} The state number (10=win, 0=draw, -10=lose)
     */
    setState(state) {
        let stateObj = document.getElementById("state")
        stateObj.className = ""
        if (state == 10) {
            stateObj.innerText = "You win!"
            stateObj.className = ""
        }
        else if (state == 0) {
            stateObj.innerText = "Draw!"
        }
        else if (state == -10) {
            stateObj.innerText = "You lose!"
        }
    }

    /**
     * Sets the player move on the tic-tac-toe grid at specific coordinates.
     * @param grid {Array[string]} The tic-tac-toe grid
     * @param coordinates {Array[number]} The coordinates of the field of the player's move
     */
    setPlayerMove(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = "O"
    }

    /**
     * Sets the bot move on the tic-tac-toe grid at specific coordinates.
     * @param grid {Array[string]} The tic-tac-toe grid
     * @param coordinates {Array[number]} The coordinates of the field of the bot's move
     */
    setBotMove(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = "X"
    }

    /**
     * Clears a field at specific coordinates.
     * @param grid {Array[string]} The tic-tac-toe grid
     * @param coordinates {Array[number]} The coordinates of the field
     */
    clearField(grid, coordinates) {
        grid[coordinates[0]][coordinates[1]] = " "
    }

    /**
     * Minimax algorithm.
     * @param tempGrid {Array[string]} A temporary copy of the tic-tac-toe grid
     * @param isMaximizer {boolean} Whether the maximizer is due or not
     * @returns {number}
     */
    minimax(tempGrid, isMaximizer) {
        let possibleFields = this.getPossibleFields(tempGrid)
        let state = this.getTerminationState(tempGrid)

        if (state == 10 || state == -10) {return state}
        if (possibleFields.length == 0) {return 0}
        
        if (isMaximizer) {
            let best = -1000
            for (let i=0; i < possibleFields.length; i++) {
                let possibleField = possibleFields[i]
                this.setBotMove(tempGrid, [possibleField[0], possibleField[1]])
                
                let possibleBest = this.minimax(tempGrid, !isMaximizer)
                best = Math.max.apply(null, [best, possibleBest])
                this.clearField(tempGrid, [possibleField[0], possibleField[1]])

            }
            return best
        }
        else {
            let best = 1000

            for (let i=0; i < possibleFields.length; i++) {
                let possibleField = possibleFields[i]
                this.setPlayerMove(tempGrid, [possibleField[0], possibleField[1]])

                let possibleBest = this.minimax(tempGrid, !isMaximizer)
                best = Math.min.apply(null, [best, possibleBest])
                this.clearField(tempGrid, [possibleField[0], possibleField[1]])
            }
            return best
        }

    }

    /**
     * Returns the best possible move of the bot.
     * @returns {Array[number]}
     */
    getBestField() {
        let possibleFields = this.getPossibleFields(this.grid)
        let tempGrid = JSON.parse(JSON.stringify(this.grid))   // deepcopy

        let bestState = -1000
        let bestField
        for (let i=0; i < possibleFields.length; i++) {
            let possibleField = possibleFields[i]
            this.setBotMove(tempGrid, [possibleField[0], [possibleField[1]]])

            let state = this.minimax(tempGrid, false)
            this.clearField(tempGrid, [possibleField[0], possibleField[1]])

            if (state > bestState) {
                bestState = state
                bestField = possibleField
            }
        }
        return bestField
    }

    /**
     * Returns the move, which has to be made for a win.
     * @param player {string} The player's symbol
     * @param grid {Array[string]} The tic-tac-toe grid
     * @returns {Array[number] | null} The field or null
     */
    getNextWinMove(player, grid) {
        let possibleFields = JSON.stringify(this.getPossibleFields(this.grid))

        // horizontal check
        for (let i=0; i<3; i++) {
            let fieldsUsedH = []
            let countH = 0
            for (let j=0; j<3; j++) {
                let field = grid[i][j]
                if (field == player) {
                    fieldsUsedH.push([i, j])
                    countH++
                }
            }
            if (countH == 2) {
                let nextField
                fieldsUsedH = JSON.stringify(fieldsUsedH)

                if (fieldsUsedH.indexOf(JSON.stringify([i, 0])) == -1) {
                    nextField = [i, 0]
                }
                else if (fieldsUsedH.indexOf(JSON.stringify([i, 1])) == -1) {
                    nextField = [i, 1]
                }
                else {
                    nextField = [i, 2]
                }

                if (possibleFields.indexOf(JSON.stringify(nextField)) != -1) {
                    return nextField
                }
            }
        }

        // vertical check
        for (let i=0; i<3; i++) {
            let fieldsUsedV = []
            let countV = 0
            for (let j=0; j<3; j++) {
                let field = grid[j][i]
                if (field == player) {
                    fieldsUsedV.push([j, i])
                    countV++
                }
            }
            if (countV == 2) {
                let nextField
                fieldsUsedV = JSON.stringify(fieldsUsedV)

                if (fieldsUsedV.indexOf(JSON.stringify([0, i])) == -1) {
                    nextField = [0, i]
                }
                else if (fieldsUsedV.indexOf(JSON.stringify([1, i])) == -1) {
                    nextField = [1, i]
                }
                else {
                    nextField = [2, i]
                }

                if (possibleFields.indexOf(JSON.stringify(nextField)) != -1) {
                    return nextField
                }
            }
        }

        // diagonal check 1
        let fieldsUsedD = []
        let countD = 0
        for (let i=0; i<3; i++) {
            let field = grid[i][i]
            if (field === player) {
                fieldsUsedD.push([i, i])
                countD++
            }
        }
        if (countD == 2) {
            let nextField
            fieldsUsedD = JSON.stringify(fieldsUsedD)

            if (fieldsUsedD.indexOf(JSON.stringify([0, 0])) == -1) {
                nextField = [0, 0]
            }
            else if (fieldsUsedD.indexOf(JSON.stringify([1, 1])) == -1) {
                nextField = [1, 1]
            }
            else {
                nextField = [2, 2]
            }

            if (possibleFields.indexOf(JSON.stringify(nextField)) != -1) {
                return nextField
            }
        }

        // diagonal check 2
        let d = 2
        fieldsUsedD = []
        countD = 0
        for (let i=0; i<3; i++) {
            let field = grid[d][i]
            if (field === player) {
                fieldsUsedD.push([d, i])
                countD++
            }

            d--
        }
        if (countD == 2) {
            let nextField
            fieldsUsedD = JSON.stringify(fieldsUsedD)

            if (fieldsUsedD.indexOf(JSON.stringify([2, 0])) == -1) {
                nextField = [2, 0]
            }
            else if (fieldsUsedD.indexOf(JSON.stringify([1, 1])) == -1) {
                nextField = [1, 1]
            }
            else {
                nextField = [0, 2]
            }

            if (possibleFields.indexOf(JSON.stringify(nextField)) != -1) {
                return nextField
            }

        }

        return null
    }

    /**
     * Returns a random field.
     * @returns {Array[number]} The random field
     */
    getRandomField() {
        let possibleFields = this.getPossibleFields(this.grid)
        let randomIndex = Math.floor(Math.random() * possibleFields.length)

        return possibleFields[randomIndex]
    }

    /**
     * Freezes every cell by resetting the classname.
     */
    freezeCells() {
        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].className = ""
        }
    }

    /**
     * Unfreezes every cell by setting the classname to 'empty'.
     */
    unfreezeCells() {
        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].className = "empty"
        }
    }

    /**
     * Resets the game.
     *  - Grid reset
     *  - Cells reset
     *  - Cells unfreeze
     *  - State reset
     */
    resetGame() {
        this.grid = [[" ", " ", " "],
                     [" ", " ", " "],
                     [" ", " ", " "]]

        let cells = this.getCells()
        for (let i=0; i<9; i++) {
            cells[i].innerText = " "
        }
        this.unfreezeCells()

        let stateObj = document.getElementById("state")
        stateObj.innerText = "state"
        stateObj.className = "no-state"

    }

    difficultySelectionChanged(difficultySelect) {
        let difficulty = difficultySelect.value

        if (difficulty == "impossible") {
            console.log("change")
            difficultySelect.className = "difficulty-impossible"
        }
        else {
            difficultySelect.className = ""
        }
        console.log(difficulty)
        this.resetGame()
    }

    /**
     * Event listener of cell click event.
     * @param event The event of the event listener
     */
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
                // player wins
                this.setState(10)
                this.freezeCells()
            }
            else {
                let possibleFields = this.getPossibleFields(this.grid)
                if (possibleFields.length == 0) {
                    // draw
                    this.setState(0)
                    this.freezeCells()
                }
                else {
                    // if not draw nor player wins: bot move
                    let difficulty = document.getElementById("difficulty-select").value

                    let botField
                    if (difficulty == "easy") {
                        botField = this.getRandomField()
                    }
                    else if (difficulty == "medium") {
                        let nextBotMoveWin = this.getNextWinMove("X", this.grid)
                        if (nextBotMoveWin !== null) {
                            botField = nextBotMoveWin
                        }
                        else {
                            let nextPlayerMoveWin = this.getNextWinMove("O", this.grid)
                            if (nextPlayerMoveWin !== null) {
                                botField = nextPlayerMoveWin

                            }
                            else {
                                botField = this.getRandomField()
                            }

                        }

                    }
                    else if (difficulty == "impossible") {
                        botField = this.getBestField()
                    }

                    this.setBotMove(this.grid, [botField[0], botField[1]])

                    let botCell = document.getElementById("" + botField[0] + botField[1])
                    botCell.innerText = "X"
                    botCell.className = ""

                    let isBotWin = this.checkWinner("X", this.grid)
                    if (isBotWin) {
                        // player loses
                        this.setState(-10)
                        this.freezeCells()
                    }
                }
            }

        }

    }

}


/**
 *
 * @param cells
 * @param ttt
 */
function addCellClickListener(cells, ttt) {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function(event){ttt.cellPressed(event)}, false)
    }

}


/**
 * Invoked when website loads.
 * Adds event listeners to objects.
 */
function load() {
    let ttt = new TicTacToe()
    let cells = ttt.getCells()
    addCellClickListener(cells, ttt)

    document.getElementById("btn-restart")
        .addEventListener("click", function(){ttt.resetGame()}, false)
    document.getElementById("difficulty-select")
        .addEventListener("change", function(){ttt.difficultySelectionChanged(this)}, false)
}

window.onload = load
// sali janick
