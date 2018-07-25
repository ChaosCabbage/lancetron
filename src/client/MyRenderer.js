import Renderer from 'lance/render/Renderer';

class Grid {
    constructor(w, h) {
        this.width = () => w
        this.height = () => h
        this.tiles = Array(w * h).fill('#41FF00')
    }

    _index(x, y) {
        return x + (y * this.width())
    }

    colour(x, y) {
        return this.tiles[this._index(x,y)]
    }

    addXMove(colour, y, from, to) {
        if (from > to) [from, to] = [to, from]

        let fromIdx = this._index(from, y)
        let toIdx = this._index(to, y)
        
        this.tiles.fill(colour, fromIdx, toIdx+1)
    }

    addYMove(colour, x, from, to) {
        if (from > to) [from, to] = [to, from]
        
        for (let y = from; y <= to; ++y) {
            this.tiles[this._index(x,y)] = colour
        }
    }

    draw(canvasContext, options) {
        canvasContext.fillStyle = 'black'
        canvasContext.fillRect(0,0, canvasContext.canvas.width, canvasContext.canvas.height)

        const defaults = {
            tileSize: 32,
            gap: 2
        }

        const { tileSize, gap } = Object.assign(defaults, options)

        for (let y = 0; y < this.height(); ++y) {
            for (let x = 0; x < this.width(); ++x) {
                const xPos = x * (tileSize + gap)
                const yPos = y * (tileSize + gap)
                canvasContext.fillStyle = this.colour(x,y)
                canvasContext.fillRect(xPos, yPos, tileSize, tileSize)
            }
        }      
        
    }

}

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine)

        this.sprites = []
        this.grid = new Grid(15, 15)
    }

    init() {
        return super.init().then(() => {
            this.canvas = document.createElement('canvas')
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            document.body.appendChild(this.canvas)
            this.context = this.canvas.getContext("2d")
        })
    }

    draw(t, dt) {
        super.draw(t, dt);
        this.grid.draw(this.context)
        for (const sprite of this.sprites) {
            console.log("Drawing sprite at ", sprite.position)
            const x = Math.floor(sprite.position.x - 0.5)
            const y = Math.floor(sprite.position.y)
            this.grid.addXMove('purple', y, x, x)
            
            this.context.fillStyle = 'pink'
            this.context.beginPath();
            this.context.arc((sprite.position.x * 34), y * 34 + 16, 16, 0, 2 * Math.PI);
            this.context.fill();
        }

    }

    addObject(obj) {
        console.log("MyRenderer#addObject(", obj, ")")
        this.sprites.push(obj)
    }

}
